/**
 * ScorePanel.tsx
 *
 * Cyber Tavla — one of the two top-corner score panels from the reference
 * image: a neon-framed glass panel showing an avatar + player name + score.
 *
 * The LEFT panel (human) shows a circular circuit-pattern avatar THEN the
 * name/score text. The RIGHT panel (AI) mirrors this — name/score text
 * THEN a rounded-square badge with a brain icon (the AI difficulty
 * indicator) — matching the reference image exactly.
 */

/**
 * External dependencies
 */
import { clsx } from 'clsx';

type ScorePanelProps = {
	side: 'left' | 'right';
	colorClass: 'magenta' | 'cyan';
	playerName: string;
	score: number;
	isActiveTurn: boolean;
	avatarKind: 'circuit' | 'brain';
};

export const ScorePanel = ( {
	side,
	colorClass,
	playerName,
	score,
	isActiveTurn,
	avatarKind,
}: ScorePanelProps ) => {
	const isMagenta = colorClass === 'magenta';
	const borderGlowClass = isMagenta
		? 'border-neon-magenta-glow'
		: 'border-neon-cyan-glow';
	const textColorClass = isMagenta ? 'text-neon-magenta' : 'text-neon-cyan';

	const avatar =
		avatarKind === 'circuit' ? (
			<div
				className={ clsx(
					'relative w-9 h-9 sm:w-14 sm:h-14 rounded-full border-2 shrink-0',
					borderGlowClass
				) }
				style={ {
					background: isMagenta
						? 'radial-gradient(circle at 35% 30%, #ff2ec4 0%, #7a0e5c 55%, #200414 100%)'
						: 'radial-gradient(circle at 35% 30%, #28f4ff 0%, #0b5e66 55%, #04191b 100%)',
				} }
			>
				<div
					className={ clsx(
						'absolute inset-0 rounded-full pointer-events-none circuit-texture',
						textColorClass
					) }
				/>
			</div>
		) : (
			<div
				className={ clsx(
					'relative w-9 h-9 sm:w-14 sm:h-14 rounded-xl border-2 shrink-0 flex items-center justify-center',
					borderGlowClass
				) }
				style={ {
					background: isMagenta
						? 'radial-gradient(circle at 35% 30%, #ff2ec4 0%, #7a0e5c 55%, #200414 100%)'
						: 'radial-gradient(circle at 35% 30%, #28f4ff 0%, #0b5e66 55%, #04191b 100%)',
				} }
			>
				<span className={ clsx( textColorClass, 'w-5 h-5 sm:w-8 sm:h-8' ) }>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={ 1.5 }
						strokeLinecap="round"
						strokeLinejoin="round"
						className="w-full h-full"
					>
						<path d="M9.5 3.5c-2 0-3.5 1.5-3.5 3.3 0 .5.1 1 .3 1.4C4.7 8.7 4 9.9 4 11.3c0 1.3.6 2.4 1.6 3.1-.1.3-.1.7-.1 1 0 2 1.6 3.6 3.6 3.6.4 0 .8-.1 1.1-.2.5.8 1.4 1.4 2.4 1.4V3.5H9.5Z" />
						<path d="M14.5 3.5c2 0 3.5 1.5 3.5 3.3 0 .5-.1 1-.3 1.4 1.6.5 2.3 1.7 2.3 3.1 0 1.3-.6 2.4-1.6 3.1.1.3.1.7.1 1 0 2-1.6 3.6-3.6 3.6-.4 0-.8-.1-1.1-.2-.5.8-1.4 1.4-2.4 1.4V3.5h3Z" />
						<path d="M9 7.8c.7-.3 1.5-.3 2.2 0" />
						<path d="M13 15.8c.7.3 1.5.3 2.2 0" />
						<path d="M7 11.3c.5.5 1.2.8 2 .8" />
					</svg>
				</span>
			</div>
		);

	const textBlock = (
		<div
			className={ clsx(
				'flex flex-col leading-tight',
				side === 'right' && 'items-end text-right'
			) }
		>
			<span
				className={ clsx(
					'font-display font-bold text-[10px] sm:text-base uppercase tracking-normal sm:tracking-wide leading-snug',
					textColorClass
				) }
			>
				{ playerName }
			</span>
			<span className="font-mono text-[9px] sm:text-sm text-white/70 tracking-widest">
				SKOR: { score }
			</span>
		</div>
	);

	return (
		<div
			className={ clsx(
				'glass-panel rounded-xl border-2 flex items-center gap-1.5 sm:gap-3 px-2 py-1.5 sm:px-4 sm:py-3 max-w-[48%] sm:max-w-none',
				borderGlowClass,
				isActiveTurn && 'animate-pulse-glow'
			) }
		>
			{ side === 'left' ? (
				<>
					{ avatar }
					{ textBlock }
				</>
			) : (
				<>
					{ textBlock }
					{ avatar }
				</>
			) }
		</div>
	);
};