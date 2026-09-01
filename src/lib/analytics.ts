export interface AnalysisRequest {
  size: number;
  noise: number;
  seed: number;
}

export interface PlotPoint {
  x: number;
  y: number;
}

export interface AnalysisResult {
  size: number;
  slope: number;
  intercept: number;
  rSquared: number;
  medianResidual: number;
  p95Residual: number;
  computeMs: number;
  points: PlotPoint[];
}

function quantile(sorted: number[], value: number): number {
  const position = (sorted.length - 1) * value;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const fraction = position - lower;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * fraction;
}

export function analyzeSyntheticSignal(request: AnalysisRequest): AnalysisResult {
  const started = performance.now();
  const size = Math.max(100, Math.min(250_000, Math.floor(request.size)));
  const noise = Math.max(0, Math.min(60, request.noise));
  let state = request.seed >>> 0 || 0x9e3779b9;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };

  const xValues = new Float64Array(size);
  const yValues = new Float64Array(size);
  let sumX = 0;
  let sumY = 0;

  for (let index = 0; index < size; index += 1) {
    const x = random() * 100;
    const centeredNoise = (random() + random() + random() + random() - 2) * noise;
    const seasonal = Math.sin(x * 0.22) * noise * 0.16;
    const y = 6 + x * 1.72 + centeredNoise + seasonal;
    xValues[index] = x;
    yValues[index] = y;
    sumX += x;
    sumY += y;
  }

  const meanX = sumX / size;
  const meanY = sumY / size;
  let covariance = 0;
  let varianceX = 0;
  let totalVariance = 0;
  for (let index = 0; index < size; index += 1) {
    const dx = xValues[index] - meanX;
    covariance += dx * (yValues[index] - meanY);
    varianceX += dx * dx;
    totalVariance += (yValues[index] - meanY) ** 2;
  }
  const slope = covariance / varianceX;
  const intercept = meanY - slope * meanX;

  const residuals = new Array<number>(size);
  let residualSquares = 0;
  const plotCount = Math.min(180, size);
  const plotStep = Math.max(1, Math.floor(size / plotCount));
  const points: PlotPoint[] = [];
  for (let index = 0; index < size; index += 1) {
    const residual = Math.abs(yValues[index] - (intercept + slope * xValues[index]));
    residuals[index] = residual;
    residualSquares += residual * residual;
    if (index % plotStep === 0 && points.length < plotCount) {
      points.push({ x: xValues[index], y: yValues[index] });
    }
  }
  residuals.sort((left, right) => left - right);

  return {
    size,
    slope,
    intercept,
    rSquared: totalVariance === 0 ? 1 : 1 - residualSquares / totalVariance,
    medianResidual: quantile(residuals, 0.5),
    p95Residual: quantile(residuals, 0.95),
    computeMs: performance.now() - started,
    points,
  };
}
