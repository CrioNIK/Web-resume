/// <reference lib="webworker" />
import { analyzeSyntheticSignal, type AnalysisRequest } from '../lib/analytics';

interface WorkerRequest extends AnalysisRequest {
  jobId: number;
}

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { jobId, ...request } = event.data;
  const result = analyzeSyntheticSignal(request);
  workerScope.postMessage({ jobId, result });
};

export {};
