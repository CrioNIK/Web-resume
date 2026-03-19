export type HudSoundName = 'boot' | 'hover' | 'confirm' | 'route' | 'panel-open' | 'panel-close';

export function emitHudSound(name: HudSoundName) {
	if (typeof window === 'undefined') {
		return;
	}

	window.dispatchEvent(new CustomEvent('hud-sound', { detail: name }));
}
