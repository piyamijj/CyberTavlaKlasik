/**
 * CircuitRail.tsx
 *
 * Cyber Tavla — thin decorative vertical strip of circuit-pattern lines
 * and code-like glyph flicker along the far left/right screen edges,
 * matching the reference image's side decorations.
 *
 * Purely decorative: `aria-hidden`, no logic, no state. Hidden on narrow
 * screens (only shows on wider viewports where there's spare horizontal
 * space beside the board).
 */

/**
 * External dependencies
 */
import { clsx } from 'clsx';

const GLYPHS = [
	'01',
	'10',
	'11',
	'AI',
	'>>',
	'<>',
	'::',
	'01',
	'00',
	'10',
	'::',
	'01',
];

export const CircuitRail = ( { side }: { side: 'left' | 'right' } ) => {
	const colorClass = side === 'left' ? 'text-neon-magenta' : 'text-neon-cyan';

	return (
		<div
			aria-hidden="true"
			className={ clsx(
				'hidden lg:flex flex-col items-center gap-3 py-8 w-14 shrink-0 font-mono text-[10px] tracking-widest select-none opacity-40',
				colorClass
			) }
		>
			{ GLYPHS.map( ( g, i ) => (
				<span
					key={ i }
					className="animate-pulse-glow"
					style={ {
						animationDelay: `${ ( i % 5 ) * 0.3 }s`,
						writingMode: 'vertical-rl',
					} }
				>
					{ g }
				</span>
			) ) }
			<div className="flex-1 w-px bg-gradient-to-b from-transparent via-current to-transparent opacity-60" />
		</div>
	);
};