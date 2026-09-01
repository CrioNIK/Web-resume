import { describe, expect, it } from 'vitest';
import { expectedTextCapabilities, normalizeModelAvailability } from './browser-language-model';

describe('browser LanguageModel negotiation', () => {
  it('normalizes current and legacy availability values', () => {
    expect(normalizeModelAvailability('available')).toBe('available');
    expect(normalizeModelAvailability('readily')).toBe('available');
    expect(normalizeModelAvailability('after-download')).toBe('downloadable');
    expect(normalizeModelAvailability('no')).toBe('unavailable');
  });

  it('uses identical input and output language promises', () => {
    expect(expectedTextCapabilities('uk')).toEqual({
      expectedInputs: [{ type: 'text', languages: ['uk'] }],
      expectedOutputs: [{ type: 'text', languages: ['uk'] }],
    });
  });
});
