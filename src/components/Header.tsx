/**
 * Header.tsx
 *
 * Cyber Tavla — top title bar. Matches the reference image: the
 * "CYBER TAVLA" title split-colored (CYBER in neon magenta, TAVLA in neon
 * cyan), flanked by diagonal hazard-stripe decorative frame ends and thin
 * horizontal neon lines fading outward toward the screen edges.
 *
 * Purely presentational — no props, no hooks.
 */

export const Header = () => {
	return (
		<header className="w-full flex items-center justify-center gap-3 sm:gap-6 px-2 sm:px-6 py-3">
			{ /* left decorative diagonal-stripe frame end + line, magenta */ }
			<div className="hidden sm:flex flex-1 items-center gap-2 max-w-[220px]">
				<div className="flex gap-[3px]">
					{ Array.from( { length: 5 } ).map( ( _, i ) => (
						<span
							key={ i }
							className="w-[3px] h-4 bg-neon-magenta/70 -skew-x-[20deg]"
						/>
					) ) }
				</div>
				<div className="flex-1 h-px bg-gradient-to-r from-neon-magenta to-transparent shadow-neon-magenta-sm" />
			</div>

			<h1 className="font-display font-black tracking-[0.15em] text-2xl sm:text-4xl whitespace-nowrap">
				<span className="text-neon-magenta">CYBER</span>{ ' ' }
				<span className="text-neon-cyan">TAVLA</span>
			</h1>

			{ /* right decorative line + diagonal-stripe frame end, cyan */ }
			<div className="hidden sm:flex flex-1 items-center gap-2 max-w-[220px] justify-end">
				<div className="flex-1 h-px bg-gradient-to-l from-neon-cyan to-transparent shadow-neon-cyan-sm" />
				<div className="flex gap-[3px]">
					{ Array.from( { length: 5 } ).map( ( _, i ) => (
						<span
							key={ i }
							className="w-[3px] h-4 bg-neon-cyan/70 -skew-x-[20deg]"
						/>
					) ) }
				</div>
			</div>
		</header>
	);
};