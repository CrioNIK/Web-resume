export type RenderMode = 'webgpu' | 'canvas' | 'static';

type Stop = () => void;

const shader = /* wgsl */ `
struct Uniforms {
  resolution: vec2f,
  pointer: vec2f,
  time: f32,
  motion: f32,
  pad: vec2f,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vertex_main(@builtin(vertex_index) index: u32) -> VertexOutput {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0)
  );
  var output: VertexOutput;
  output.position = vec4f(positions[index], 0.0, 1.0);
  output.uv = output.position.xy * 0.5 + 0.5;
  return output;
}

fn line(value: f32, width: f32) -> f32 {
  return 1.0 - smoothstep(width, width + 0.012, abs(value));
}

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
  let aspect = uniforms.resolution.x / max(uniforms.resolution.y, 1.0);
  var p = (input.uv - 0.5) * vec2f(aspect, 1.0);
  let pointer = (uniforms.pointer - 0.5) * vec2f(aspect, 1.0);
  let t = uniforms.time * uniforms.motion;

  let gridUv = p * 11.0;
  let gridX = line(abs(fract(gridUv.x) - 0.5) - 0.49, 0.006);
  let gridY = line(abs(fract(gridUv.y) - 0.5) - 0.49, 0.006);
  let grid = max(gridX, gridY) * (0.18 + 0.22 * smoothstep(0.9, 0.0, length(p)));

  let shifted = p - pointer * 0.18;
  let radius = length(shifted);
  let angle = atan2(shifted.y, shifted.x);
  let ringA = line(radius - 0.34 - sin(angle * 5.0 + t) * 0.035, 0.008);
  let ringB = line(radius - 0.53 - cos(angle * 3.0 - t * 0.7) * 0.025, 0.005);
  let diagonal = line(p.y - p.x * 0.28 - sin(p.x * 7.0 + t) * 0.045, 0.006);

  let nodeGrid = abs(fract((p + vec2f(t * 0.006, 0.0)) * 7.0) - 0.5);
  let nodes = 1.0 - smoothstep(0.025, 0.055, length(nodeGrid));
  let glow = 0.025 / max(abs(radius - 0.34), 0.015);

  let coral = vec3f(1.0, 0.24, 0.16);
  let mint = vec3f(0.24, 0.92, 0.72);
  let violet = vec3f(0.48, 0.39, 1.0);
  var color = vec3f(0.018, 0.022, 0.035);
  color += grid * violet * 0.20;
  color += ringA * coral * 0.82;
  color += ringB * mint * 0.58;
  color += diagonal * violet * 0.60;
  color += nodes * mix(mint, coral, input.uv.x) * 0.46;
  color += glow * coral * 0.085;
  color *= 0.66 + 0.34 * smoothstep(1.1, 0.15, length(p));

  return vec4f(color, 1.0);
}
`;

function fitCanvas(canvas: HTMLCanvasElement): { width: number; height: number } {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width * ratio));
  const height = Math.max(1, Math.floor(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height };
}

async function startWebGpu(canvas: HTMLCanvasElement, reducedMotion: boolean): Promise<Stop | null> {
  if (!navigator.gpu) return null;
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
  if (!adapter) return null;
  const device = await adapter.requestDevice();
  const context = canvas.getContext('webgpu');
  if (!context) return null;

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: 'opaque' });
  const module = device.createShaderModule({ code: shader });
  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: { module, entryPoint: 'vertex_main' },
    fragment: { module, entryPoint: 'fragment_main', targets: [{ format }] },
    primitive: { topology: 'triangle-list' },
  });
  const uniformBuffer = device.createBuffer({
    size: 32,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });
  const pointer = { x: 0.5, y: 0.5 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = event.clientX / Math.max(window.innerWidth, 1);
    pointer.y = 1 - event.clientY / Math.max(window.innerHeight, 1);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let frame = 0;
  let active = true;
  const start = performance.now();
  const render = (now: number) => {
    if (!active) return;
    const { width, height } = fitCanvas(canvas);
    const data = new Float32Array([
      width,
      height,
      pointer.x,
      pointer.y,
      (now - start) / 1000,
      reducedMotion ? 0 : 1,
      0,
      0,
    ]);
    device.queue.writeBuffer(uniformBuffer, 0, data);
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.01, g: 0.012, b: 0.018, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.draw(3);
    pass.end();
    device.queue.submit([encoder.finish()]);
    if (!reducedMotion) frame = requestAnimationFrame(render);
  };
  render(performance.now());

  return () => {
    active = false;
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onPointer);
    uniformBuffer.destroy();
    device.destroy();
  };
}

function startCanvas2d(canvas: HTMLCanvasElement, reducedMotion: boolean): Stop {
  const context = canvas.getContext('2d');
  if (!context) return () => undefined;
  let frame = 0;
  let active = true;
  const start = performance.now();

  const render = (now: number) => {
    if (!active) return;
    const { width, height } = fitCanvas(canvas);
    const t = reducedMotion ? 0 : (now - start) / 1000;
    context.fillStyle = '#07080b';
    context.fillRect(0, 0, width, height);
    context.lineWidth = Math.max(1, width / 1500);

    context.strokeStyle = 'rgba(126, 103, 255, .12)';
    const gap = Math.max(42, width / 18);
    context.beginPath();
    for (let x = 0; x < width; x += gap) { context.moveTo(x, 0); context.lineTo(x, height); }
    for (let y = 0; y < height; y += gap) { context.moveTo(0, y); context.lineTo(width, y); }
    context.stroke();

    const cx = width * 0.68;
    const cy = height * 0.48;
    for (let ring = 0; ring < 3; ring += 1) {
      context.strokeStyle = ring === 1 ? 'rgba(82,230,184,.58)' : 'rgba(255,76,55,.7)';
      context.beginPath();
      const radius = Math.min(width, height) * (0.16 + ring * 0.11);
      for (let point = 0; point <= 180; point += 1) {
        const angle = (point / 180) * Math.PI * 2;
        const pulse = Math.sin(angle * (3 + ring) + t * (0.9 - ring * 0.1)) * 8;
        const x = cx + Math.cos(angle) * (radius + pulse);
        const y = cy + Math.sin(angle) * (radius + pulse);
        if (point === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
    }

    context.fillStyle = 'rgba(255,92,68,.72)';
    for (let index = 0; index < 42; index += 1) {
      const phase = index * 2.399 + t * 0.11;
      const radius = Math.sqrt(index / 42) * Math.min(width, height) * 0.43;
      context.fillRect(cx + Math.cos(phase) * radius, cy + Math.sin(phase) * radius, 2, 2);
    }

    if (!reducedMotion) frame = requestAnimationFrame(render);
  };
  render(performance.now());

  return () => {
    active = false;
    cancelAnimationFrame(frame);
  };
}

export async function startHorizonField(
  canvas: HTMLCanvasElement,
  onMode: (mode: RenderMode) => void,
): Promise<Stop> {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    onMode('static');
    return startCanvas2d(canvas, true);
  }

  try {
    const stopWebGpu = await startWebGpu(canvas, false);
    if (stopWebGpu) {
      onMode('webgpu');
      return stopWebGpu;
    }
  } catch {
    // Capability negotiation is expected to fail on browsers without WebGPU.
  }

  onMode('canvas');
  return startCanvas2d(canvas, false);
}
