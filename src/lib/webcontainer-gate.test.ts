import { describe, expect, it } from 'vitest';
import { evaluateWebContainerGate } from './webcontainer-gate';

const supported = {
  enabled: true,
  secureContext: true,
  crossOriginIsolated: true,
  sharedArrayBuffer: true,
};

describe('WebContainer production gate', () => {
  it('keeps production disabled until a license flag is explicit', () => {
    expect(evaluateWebContainerGate({ ...supported, enabled: false })).toEqual({
      ready: false,
      reason: 'license',
    });
  });

  it('requires cross-origin isolation and shared memory', () => {
    expect(evaluateWebContainerGate({ ...supported, crossOriginIsolated: false }).reason).toBe('isolation');
    expect(evaluateWebContainerGate({ ...supported, sharedArrayBuffer: false }).reason).toBe('shared-memory');
  });

  it('opens only when every prerequisite is explicit', () => {
    expect(evaluateWebContainerGate(supported)).toEqual({ ready: true, reason: 'ready' });
  });
});
