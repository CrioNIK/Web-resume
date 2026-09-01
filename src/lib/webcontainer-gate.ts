export interface WebContainerEnvironment {
  enabled: boolean;
  secureContext: boolean;
  crossOriginIsolated: boolean;
  sharedArrayBuffer: boolean;
}

export type WebContainerGate =
  | { ready: true; reason: 'ready' }
  | { ready: false; reason: 'license' | 'https' | 'isolation' | 'shared-memory' };

export function evaluateWebContainerGate(environment: WebContainerEnvironment): WebContainerGate {
  if (!environment.enabled) return { ready: false, reason: 'license' };
  if (!environment.secureContext) return { ready: false, reason: 'https' };
  if (!environment.crossOriginIsolated) return { ready: false, reason: 'isolation' };
  if (!environment.sharedArrayBuffer) return { ready: false, reason: 'shared-memory' };
  return { ready: true, reason: 'ready' };
}
