/**
 * soundManager.ts
 *
 * Cyber Tavla — synthesized digital sound engine.
 *
 * All sound effects here are generated in real time with the Web Audio API
 * (OscillatorNode + GainNode envelopes). There are no audio files: every
 * click / roll / move / hit / notice sound is a small "chiptune" style beep
 * synthesized on the fly, fitting the neon/holographic theme of the game.
 *
 * Design notes:
 * - A single shared AudioContext is created lazily, on the first call that
 *   happens as a result of a user gesture (click/keypress/touch), to respect
 *   browser autoplay policies. Nothing is created at module load time.
 * - Every public function is wrapped in try/catch and silently no-ops if the
 *   Web Audio API is unavailable (SSR, very old browsers, locked-down
 *   embedded webviews, etc.) — sound is a nice-to-have, never a crash source.
 * - A master enabled/disabled flag (see setSoundEnabled) lets the app mute
 *   all effects (e.g. from the MENÜ modal's sound toggle) without touching
 *   any call site.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

/** Master on/off switch. When disabled, every play* call becomes a no-op. */
export function setSoundEnabled( enabled: boolean ): void {
	soundEnabled = enabled;
}

/** Returns whether sound effects are currently enabled. */
export function isSoundEnabled(): boolean {
	return soundEnabled;
}

/**
 * Lazily creates (or resumes) the shared AudioContext.
 * Returns null if the Web Audio API is not available or construction fails,
 * so callers can silently skip playback instead of throwing.
 */
function getAudioContext(): AudioContext | null {
	try {
		if ( ! audioCtx ) {
			const Ctor: typeof AudioContext | undefined =
				window.AudioContext ||
				( window as unknown as { webkitAudioContext?: typeof AudioContext } )
					.webkitAudioContext;
			if ( ! Ctor ) {
				return null;
			}
			audioCtx = new Ctor();
		}
		if ( audioCtx.state === 'suspended' ) {
			// Best-effort resume; ignore rejection (needs a user gesture on some browsers).
			void audioCtx.resume().catch( () => {
				/* ignore */
			} );
		}
		return audioCtx;
	} catch {
		return null;
	}
}

type Envelope = {
	/** Oscillator waveform. */
	type: OscillatorType;
	/** Start frequency in Hz. */
	freq: number;
	/** Optional end frequency in Hz — when set, the oscillator glides from freq to endFreq. */
	endFreq?: number;
	/** Total duration in seconds. */
	duration: number;
	/** Peak gain (0..1). Kept modest so effects stay crisp, not loud. */
	peakGain?: number;
	/** Delay in seconds before this tone starts, relative to "now". */
	delay?: number;
};

/**
 * Plays one synthesized tone: an oscillator through a gain envelope
 * (fast attack, exponential decay) straight to the output.
 */
function playTone( ctx: AudioContext, env: Envelope ): void {
	try {
		const now = ctx.currentTime + ( env.delay ?? 0 );
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = env.type;
		osc.frequency.setValueAtTime( env.freq, now );
		if ( env.endFreq !== undefined ) {
			osc.frequency.exponentialRampToValueAtTime(
				Math.max( env.endFreq, 1 ),
				now + env.duration
			);
		}

		const peakGain = env.peakGain ?? 0.18;
		gain.gain.setValueAtTime( 0.0001, now );
		gain.gain.exponentialRampToValueAtTime( peakGain, now + 0.01 );
		gain.gain.exponentialRampToValueAtTime( 0.0001, now + env.duration );

		osc.connect( gain );
		gain.connect( ctx.destination );

		osc.start( now );
		osc.stop( now + env.duration + 0.05 );
	} catch {
		/* ignore — sound is best-effort only */
	}
}

/**
 * Plays a list of tones (each with its own delay) through the shared
 * AudioContext. No-ops entirely if audio is unavailable or muted.
 */
function playSequence( envelopes: Envelope[] ): void {
	if ( ! soundEnabled ) {
		return;
	}
	const ctx = getAudioContext();
	if ( ! ctx ) {
		return;
	}
	envelopes.forEach( ( env ) => playTone( ctx, env ) );
}

/**
 * Short high blip for button presses (ZAR AT / HAMLE YAP / MENÜ, menu items).
 */
export function playClick(): void {
	playSequence( [
		{ type: 'square', freq: 1200, duration: 0.06, peakGain: 0.08 },
	] );
}

/**
 * Rapid rattle of short ticks suggesting dice tumbling.
 */
export function playDiceRoll(): void {
	playSequence( [
		{ type: 'square', freq: 900, duration: 0.05, peakGain: 0.1, delay: 0 },
		{ type: 'square', freq: 750, duration: 0.05, peakGain: 0.1, delay: 0.06 },
		{ type: 'square', freq: 820, duration: 0.05, peakGain: 0.1, delay: 0.12 },
		{ type: 'square', freq: 700, duration: 0.05, peakGain: 0.1, delay: 0.18 },
		{ type: 'square', freq: 780, duration: 0.05, peakGain: 0.1, delay: 0.24 },
	] );
}

/**
 * Quick gliding tone representing a checker sliding into place.
 */
export function playMove(): void {
	playSequence( [
		{ type: 'sine', freq: 500, endFreq: 350, duration: 0.12, peakGain: 0.14 },
	] );
}

/**
 * Sharper, dramatic descending tone for hitting an opponent's checker.
 */
export function playHit(): void {
	playSequence( [
		{ type: 'square', freq: 1400, duration: 0.03, peakGain: 0.12, delay: 0 },
		{ type: 'sawtooth', freq: 700, endFreq: 150, duration: 0.25, peakGain: 0.22, delay: 0 },
	] );
}

/**
 * Low descending buzz for illegal-move / error notices.
 */
export function playError(): void {
	playSequence( [
		{ type: 'square', freq: 220, duration: 0.09, peakGain: 0.15, delay: 0 },
		{ type: 'square', freq: 160, duration: 0.09, peakGain: 0.15, delay: 0.1 },
	] );
}

/**
 * Short ascending triumphant triad for game-over / win notices.
 */
export function playWin(): void {
	playSequence( [
		{ type: 'sine', freq: 523, duration: 0.18, peakGain: 0.16, delay: 0 },
		{ type: 'sine', freq: 659, duration: 0.18, peakGain: 0.16, delay: 0.12 },
		{ type: 'sine', freq: 784, duration: 0.18, peakGain: 0.18, delay: 0.24 },
	] );
}

/**
 * Single soft blip for generic info notices.
 */
export function playNotify(): void {
	playSequence( [
		{ type: 'sine', freq: 600, duration: 0.08, peakGain: 0.1 },
	] );
}