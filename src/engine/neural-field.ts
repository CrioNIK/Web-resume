import {
  createNeuralInputs,
  inferNeuralReference,
  NEURAL_HIDDEN_BIASES,
  NEURAL_HIDDEN_WEIGHTS,
  NEURAL_OUTPUT_BIASES,
  NEURAL_OUTPUT_WEIGHTS,
  normalizeNeuralBatchSize,
} from '../lib/neural-reference';

export type NeuralFieldMode = 'negotiating' | 'webgpu' | 'canvas' | 'static' | 'error';
export type NeuralFallbackReason = 'webgpu-unavailable' | 'webgpu-failed' | 'device-lost';

export interface NeuralFieldMetrics {
  batchSize: number;
  cpuReferenceMs: number;
  cpuSubmitMs: number | null;
  gpuComputeMs: number | null;
  gpuRenderMs: number | null;
  maxAbsoluteError: number | null;
  timestampQuery: boolean;
}

export interface NeuralFieldSnapshot {
  mode: NeuralFieldMode;
  metrics: NeuralFieldMetrics | null;
  reason?: NeuralFallbackReason;
  reducedMotion: boolean;
}

export interface NeuralFieldOptions {
  batchSize: number;
  fallbackCanvas?: HTMLCanvasElement;
  onSnapshot(snapshot: NeuralFieldSnapshot): void;
  seed?: number;
}

type Stop = () => void;

const workgroupSize = 64;

function wgslNumbers(values: readonly number[]): string {
  return values.map((value) => {
    const literal = value.toString();
    return literal.includes('.') ? literal : `${literal}.0`;
  }).join(', ');
}

const computeShader = /* wgsl */ `
struct Vectors {
  values: array<vec4f>,
}

struct Meta {
  count: u32,
  phase: f32,
  point_scale: f32,
  aspect: f32,
}

const HIDDEN_WEIGHTS = array<f32, 32>(${wgslNumbers(NEURAL_HIDDEN_WEIGHTS)});
const HIDDEN_BIASES = array<f32, 8>(${wgslNumbers(NEURAL_HIDDEN_BIASES)});
const OUTPUT_WEIGHTS = array<f32, 32>(${wgslNumbers(NEURAL_OUTPUT_WEIGHTS)});
const OUTPUT_BIASES = array<f32, 4>(${wgslNumbers(NEURAL_OUTPUT_BIASES)});

@group(0) @binding(0) var<storage, read> network_inputs: Vectors;
@group(0) @binding(1) var<storage, read_write> network_outputs: Vectors;
@group(0) @binding(2) var<uniform> parameters: Meta;

@compute @workgroup_size(${workgroupSize})
fn infer(@builtin(global_invocation_id) id: vec3u) {
  let index = id.x;
  if (index >= parameters.count) {
    return;
  }

  let original = network_inputs.values[index];
  let angle = parameters.phase * 0.12;
  let sine = sin(angle);
  let cosine = cos(angle);
  let input = vec4f(
    original.x * cosine - original.y * sine,
    original.x * sine + original.y * cosine,
    original.z * cosine + original.w * sine,
    original.w * cosine - original.z * sine
  );

  var hidden: array<f32, 8>;
  for (var hidden_index = 0u; hidden_index < 8u; hidden_index += 1u) {
    var value = HIDDEN_BIASES[hidden_index];
    for (var input_index = 0u; input_index < 4u; input_index += 1u) {
      value += input[input_index] * HIDDEN_WEIGHTS[hidden_index * 4u + input_index];
    }
    hidden[hidden_index] = tanh(value);
  }

  var output: vec4f;
  for (var output_index = 0u; output_index < 4u; output_index += 1u) {
    var value = OUTPUT_BIASES[output_index];
    for (var hidden_index = 0u; hidden_index < 8u; hidden_index += 1u) {
      value += hidden[hidden_index] * OUTPUT_WEIGHTS[output_index * 8u + hidden_index];
    }
    output[output_index] = tanh(value);
  }
  network_outputs.values[index] = output;
}
`;

const renderShader = /* wgsl */ `
struct Vectors {
  values: array<vec4f>,
}

struct Meta {
  count: u32,
  phase: f32,
  point_scale: f32,
  aspect: f32,
}

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
  @location(1) local: vec2f,
}

@group(0) @binding(0) var<storage, read> network_outputs: Vectors;
@group(0) @binding(1) var<uniform> parameters: Meta;

@vertex
fn vertex_main(
  @builtin(vertex_index) vertex_index: u32,
  @builtin(instance_index) instance_index: u32,
) -> VertexOutput {
  let corners = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0)
  );
  let neural = network_outputs.values[instance_index];
  let local = corners[vertex_index];
  let center = neural.xy * vec2f(0.88 / max(parameters.aspect, 1.0), 0.88);
  let radius = parameters.point_scale * (0.72 + (neural.w * 0.5 + 0.5) * 0.72);
  let offset = local * vec2f(radius / max(parameters.aspect, 1.0), radius);
  let coral = vec3f(1.0, 0.29, 0.20);
  let mint = vec3f(0.28, 0.94, 0.74);
  let violet = vec3f(0.49, 0.40, 1.0);
  let hue = mix(coral, mint, neural.z * 0.5 + 0.5);

  var result: VertexOutput;
  result.position = vec4f(center + offset, 0.0, 1.0);
  result.color = vec4f(mix(hue, violet, abs(neural.w) * 0.24), 0.18);
  result.local = local;
  return result;
}

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
  if (dot(input.local, input.local) > 1.0) {
    discard;
  }
  let glow = 1.0 - smoothstep(0.15, 1.0, length(input.local));
  return vec4f(input.color.rgb * (0.62 + glow * 0.76), input.color.a * (0.45 + glow));
}
`;

function now(): number {
  return globalThis.performance.now();
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function fitCanvas(canvas: HTMLCanvasElement): { width: number; height: number; aspect: number } {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width * ratio));
  const height = Math.max(1, Math.floor(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height, aspect: width / Math.max(height, 1) };
}

function createMeta(count: number, phase: number, pointScale: number, aspect: number): ArrayBuffer {
  const bytes = new ArrayBuffer(16);
  const view = new DataView(bytes);
  view.setUint32(0, count, true);
  view.setFloat32(4, phase, true);
  view.setFloat32(8, pointScale, true);
  view.setFloat32(12, aspect, true);
  return bytes;
}

function referenceMetrics(
  batchSize: number,
  cpuReferenceMs: number,
  overrides: Partial<NeuralFieldMetrics> = {},
): NeuralFieldMetrics {
  return {
    batchSize,
    cpuReferenceMs,
    cpuSubmitMs: null,
    gpuComputeMs: null,
    gpuRenderMs: null,
    maxAbsoluteError: null,
    timestampQuery: false,
    ...overrides,
  };
}

function startCanvasReference(
  canvas: HTMLCanvasElement,
  output: Float32Array,
  metrics: NeuralFieldMetrics,
  onSnapshot: NeuralFieldOptions['onSnapshot'],
  reducedMotion: boolean,
  reason: NeuralFallbackReason,
): Stop {
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    onSnapshot({ mode: 'error', metrics, reason, reducedMotion });
    return () => undefined;
  }

  let active = true;
  let frame = 0;
  const started = now();
  const count = output.length / 4;
  const step = Math.max(1, Math.ceil(count / 12_000));

  const draw = (timestamp: number) => {
    if (!active) return;
    const { width, height } = fitCanvas(canvas);
    const phase = reducedMotion ? 0 : (timestamp - started) * 0.000075;
    const sine = Math.sin(phase);
    const cosine = Math.cos(phase);
    context.fillStyle = '#07090e';
    context.fillRect(0, 0, width, height);

    const gradient = context.createRadialGradient(
      width * 0.5,
      height * 0.5,
      0,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.62,
    );
    gradient.addColorStop(0, 'rgba(126, 103, 255, .12)');
    gradient.addColorStop(1, 'rgba(7, 9, 14, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'lighter';

    for (let palette = 0; palette < 2; palette += 1) {
      context.fillStyle = palette === 0 ? 'rgba(255, 76, 55, .34)' : 'rgba(82, 230, 184, .30)';
      for (let index = palette * step; index < count; index += step * 2) {
        const offset = index * 4;
        const baseX = output[offset];
        const baseY = output[offset + 1];
        const x = baseX * cosine - baseY * sine;
        const y = baseX * sine + baseY * cosine;
        const px = (0.5 + x * 0.42) * width;
        const py = (0.5 + y * 0.42) * height;
        const radius = 0.7 + (output[offset + 3] * 0.5 + 0.5) * 1.4;
        context.fillRect(px, py, radius, radius);
      }
    }
    context.globalCompositeOperation = 'source-over';

    if (!reducedMotion) frame = requestAnimationFrame(draw);
  };

  onSnapshot({
    mode: reducedMotion ? 'static' : 'canvas',
    metrics,
    reason,
    reducedMotion,
  });
  draw(now());

  const resizeObserver = reducedMotion && typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(() => draw(started))
    : null;
  resizeObserver?.observe(canvas);

  return () => {
    active = false;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
  };
}

function maxAbsoluteError(reference: Float32Array, candidate: Float32Array): number {
  let maximum = 0;
  for (let index = 0; index < reference.length; index += 1) {
    maximum = Math.max(maximum, Math.abs(reference[index] - candidate[index]));
  }
  return maximum;
}

async function assertShaderCompiles(module: GPUShaderModule): Promise<void> {
  const info = await module.getCompilationInfo();
  const errors = info.messages.filter((message) => message.type === 'error');
  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.message).join('\n'));
  }
}

async function startWebGpu(
  canvas: HTMLCanvasElement,
  inputs: Float32Array,
  reference: Float32Array,
  cpuReferenceMs: number,
  onSnapshot: NeuralFieldOptions['onSnapshot'],
  reducedMotion: boolean,
  fallbackCanvas: HTMLCanvasElement,
): Promise<Stop | null> {
  if (!navigator.gpu) return null;
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter) return null;

  const timestampQuery = adapter.features.has('timestamp-query');
  const requiredFeatures: GPUFeatureName[] = timestampQuery ? ['timestamp-query'] : [];
  const device = await adapter.requestDevice({ requiredFeatures });
  const context = canvas.getContext('webgpu');
  if (!context) {
    device.destroy();
    return null;
  }

  try {
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: 'opaque' });
    const computeModule = device.createShaderModule({ label: 'neural-mlp-compute', code: computeShader });
    const renderModule = device.createShaderModule({ label: 'neural-particle-render', code: renderShader });
    await Promise.all([assertShaderCompiles(computeModule), assertShaderCompiles(renderModule)]);

    const computeLayout = device.createBindGroupLayout({
      label: 'neural-compute-layout',
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
      ],
    });
    const renderLayout = device.createBindGroupLayout({
      label: 'neural-render-layout',
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
      ],
    });

    const [computePipeline, renderPipeline] = await Promise.all([
      device.createComputePipelineAsync({
        label: 'neural-4x8x4-mlp',
        layout: device.createPipelineLayout({ bindGroupLayouts: [computeLayout] }),
        compute: { module: computeModule, entryPoint: 'infer' },
      }),
      device.createRenderPipelineAsync({
        label: 'neural-field-particles',
        layout: device.createPipelineLayout({ bindGroupLayouts: [renderLayout] }),
        vertex: { module: renderModule, entryPoint: 'vertex_main' },
        fragment: {
          module: renderModule,
          entryPoint: 'fragment_main',
          targets: [{
            format,
            blend: {
              color: { srcFactor: 'src-alpha', dstFactor: 'one', operation: 'add' },
              alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            },
          }],
        },
        primitive: { topology: 'triangle-list' },
      }),
    ]);

    const byteLength = inputs.byteLength;
    const inputBuffer = device.createBuffer({
      label: 'neural-inputs',
      size: byteLength,
      usage: GPUBufferUsage.STORAGE,
      mappedAtCreation: true,
    });
    new Float32Array(inputBuffer.getMappedRange()).set(inputs);
    inputBuffer.unmap();
    const outputBuffer = device.createBuffer({
      label: 'neural-outputs',
      size: byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    const metaBuffer = device.createBuffer({
      label: 'neural-meta',
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const computeBindGroup = device.createBindGroup({
      layout: computeLayout,
      entries: [
        { binding: 0, resource: { buffer: inputBuffer } },
        { binding: 1, resource: { buffer: outputBuffer } },
        { binding: 2, resource: { buffer: metaBuffer } },
      ],
    });
    const renderBindGroup = device.createBindGroup({
      layout: renderLayout,
      entries: [
        { binding: 0, resource: { buffer: outputBuffer } },
        { binding: 1, resource: { buffer: metaBuffer } },
      ],
    });

    const readbackBuffer = device.createBuffer({
      label: 'neural-validation-readback',
      size: byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    const querySet = timestampQuery ? device.createQuerySet({ type: 'timestamp', count: 4 }) : null;
    const queryResolveBuffer = querySet ? device.createBuffer({
      label: 'neural-timestamp-resolve',
      size: 32,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    }) : null;
    const queryReadBuffer = querySet ? device.createBuffer({
      label: 'neural-timestamp-readback',
      size: 32,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    }) : null;

    let sessionActive = true;
    let gpuActive = true;
    let frame = 0;
    let fallbackStop: Stop | null = null;
    let resourcesDestroyed = false;
    const started = now();
    const batchSize = inputs.length / 4;
    const pointScale = Math.max(0.0024, Math.min(0.008, 0.006 * Math.sqrt(16_384 / batchSize)));

    const encodeFrame = (phase: number, measure: boolean): number => {
      const { aspect } = fitCanvas(canvas);
      device.queue.writeBuffer(metaBuffer, 0, createMeta(batchSize, phase, pointScale, aspect));
      const cpuSubmitStarted = now();
      const encoder = device.createCommandEncoder({ label: measure ? 'neural-measured-frame' : 'neural-frame' });
      const computePass = encoder.beginComputePass(measure && querySet ? {
        timestampWrites: {
          querySet,
          beginningOfPassWriteIndex: 0,
          endOfPassWriteIndex: 1,
        },
      } : undefined);
      computePass.setPipeline(computePipeline);
      computePass.setBindGroup(0, computeBindGroup);
      computePass.dispatchWorkgroups(Math.ceil(batchSize / workgroupSize));
      computePass.end();

      const renderPass = encoder.beginRenderPass({
        colorAttachments: [{
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0.008, g: 0.01, b: 0.017, a: 1 },
          loadOp: 'clear',
          storeOp: 'store',
        }],
        ...(measure && querySet ? {
          timestampWrites: {
            querySet,
            beginningOfPassWriteIndex: 2,
            endOfPassWriteIndex: 3,
          },
        } : {}),
      });
      renderPass.setPipeline(renderPipeline);
      renderPass.setBindGroup(0, renderBindGroup);
      renderPass.draw(6, batchSize);
      renderPass.end();

      if (measure) {
        encoder.copyBufferToBuffer(outputBuffer, 0, readbackBuffer, 0, byteLength);
        if (querySet && queryResolveBuffer && queryReadBuffer) {
          encoder.resolveQuerySet(querySet, 0, 4, queryResolveBuffer, 0);
          encoder.copyBufferToBuffer(queryResolveBuffer, 0, queryReadBuffer, 0, 32);
        }
      }
      device.queue.submit([encoder.finish()]);
      return now() - cpuSubmitStarted;
    };

    const cpuSubmitMs = encodeFrame(0, true);
    await readbackBuffer.mapAsync(GPUMapMode.READ);
    const candidate = new Float32Array(readbackBuffer.getMappedRange());
    const validationError = maxAbsoluteError(reference, candidate);
    readbackBuffer.unmap();

    let gpuComputeMs: number | null = null;
    let gpuRenderMs: number | null = null;
    if (queryReadBuffer) {
      await queryReadBuffer.mapAsync(GPUMapMode.READ);
      const timestamps = new BigUint64Array(queryReadBuffer.getMappedRange());
      gpuComputeMs = Number(timestamps[1] - timestamps[0]) / 1_000_000;
      gpuRenderMs = Number(timestamps[3] - timestamps[2]) / 1_000_000;
      queryReadBuffer.unmap();
    }

    readbackBuffer.destroy();
    queryReadBuffer?.destroy();
    queryResolveBuffer?.destroy();
    querySet?.destroy();

    const metrics = referenceMetrics(batchSize, cpuReferenceMs, {
      cpuSubmitMs,
      gpuComputeMs,
      gpuRenderMs,
      maxAbsoluteError: validationError,
      timestampQuery,
    });
    onSnapshot({ mode: 'webgpu', metrics, reducedMotion });

    const render = (timestamp: number) => {
      if (!sessionActive || !gpuActive) return;
      encodeFrame(reducedMotion ? 0 : (timestamp - started) * 0.001, false);
      if (!reducedMotion) frame = requestAnimationFrame(render);
    };
    if (!reducedMotion) frame = requestAnimationFrame(render);

    const resizeObserver = reducedMotion && typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => render(started))
      : null;
    resizeObserver?.observe(canvas);

    const destroyGpuResources = (destroyDevice: boolean) => {
      if (resourcesDestroyed) return;
      resourcesDestroyed = true;
      gpuActive = false;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      inputBuffer.destroy();
      outputBuffer.destroy();
      metaBuffer.destroy();
      if (destroyDevice) device.destroy();
    };

    void device.lost.then(() => {
      if (!sessionActive) return;
      destroyGpuResources(false);
      fallbackStop = startCanvasReference(
        fallbackCanvas,
        reference,
        referenceMetrics(batchSize, cpuReferenceMs),
        onSnapshot,
        reducedMotion,
        'device-lost',
      );
    });

    return () => {
      sessionActive = false;
      fallbackStop?.();
      destroyGpuResources(true);
    };
  } catch (error) {
    device.destroy();
    throw error;
  }
}

export async function startNeuralField(
  canvas: HTMLCanvasElement,
  options: NeuralFieldOptions,
): Promise<Stop> {
  const batchSize = normalizeNeuralBatchSize(options.batchSize);
  const fallbackCanvas = options.fallbackCanvas ?? canvas;
  const reducedMotion = prefersReducedMotion();
  options.onSnapshot({ mode: 'negotiating', metrics: null, reducedMotion });

  const inputs = createNeuralInputs(batchSize, options.seed);
  const referenceStarted = now();
  const reference = inferNeuralReference(inputs);
  const cpuReferenceMs = now() - referenceStarted;

  if (!navigator.gpu) {
    return startCanvasReference(
      fallbackCanvas,
      reference,
      referenceMetrics(batchSize, cpuReferenceMs),
      options.onSnapshot,
      reducedMotion,
      'webgpu-unavailable',
    );
  }

  try {
    const stop = await startWebGpu(
      canvas,
      inputs,
      reference,
      cpuReferenceMs,
      options.onSnapshot,
      reducedMotion,
      fallbackCanvas,
    );
    if (stop) return stop;
  } catch {
    return startCanvasReference(
      fallbackCanvas,
      reference,
      referenceMetrics(batchSize, cpuReferenceMs),
      options.onSnapshot,
      reducedMotion,
      'webgpu-failed',
    );
  }

  return startCanvasReference(
    fallbackCanvas,
    reference,
    referenceMetrics(batchSize, cpuReferenceMs),
    options.onSnapshot,
    reducedMotion,
    'webgpu-unavailable',
  );
}
