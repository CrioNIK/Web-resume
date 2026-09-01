export type BrowserModelAvailability = 'unavailable' | 'downloadable' | 'downloading' | 'available';

export interface BrowserLanguageModelSession {
  promptStreaming(input: string, options?: { signal?: AbortSignal }): AsyncIterable<string>;
  destroy(): void;
}

export interface BrowserLanguageModelMonitor extends EventTarget {
  addEventListener(
    type: 'downloadprogress',
    listener: (event: Event & { loaded?: number }) => void,
  ): void;
}

export interface BrowserLanguageModelOptions {
  initialPrompts: Array<{ role: 'system'; content: string }>;
  expectedInputs: Array<{ type: 'text'; languages: string[] }>;
  expectedOutputs: Array<{ type: 'text'; languages: string[] }>;
  signal?: AbortSignal;
  monitor?: (monitor: BrowserLanguageModelMonitor) => void;
}

export interface BrowserLanguageModelApi {
  availability(options: Omit<BrowserLanguageModelOptions, 'initialPrompts' | 'signal' | 'monitor'>): Promise<string>;
  create(options: BrowserLanguageModelOptions): Promise<BrowserLanguageModelSession>;
}

export function normalizeModelAvailability(value: unknown): BrowserModelAvailability {
  if (value === 'available' || value === 'readily') return 'available';
  if (value === 'downloadable' || value === 'after-download') return 'downloadable';
  if (value === 'downloading') return 'downloading';
  return 'unavailable';
}

export function expectedTextCapabilities(locale: 'en' | 'uk') {
  const languages = [locale];
  return {
    expectedInputs: [{ type: 'text' as const, languages }],
    expectedOutputs: [{ type: 'text' as const, languages }],
  };
}

export function getBrowserLanguageModel(): BrowserLanguageModelApi | null {
  const candidate = (globalThis as typeof globalThis & {
    LanguageModel?: BrowserLanguageModelApi;
  }).LanguageModel;
  return typeof candidate?.create === 'function' && typeof candidate.availability === 'function'
    ? candidate
    : null;
}
