/**
 * TurnBar.tsx
 *
 * Cyber Tavla — decorative center strip between the score panels and the
 * board: a row of thin animated frequency/audio-visualizer bars (magenta
 * fading into cyan, left to right) with a plain-language turn-status
 * readout beneath it (e.g. "SIRA SENDE").
 *
 * Purely presentational — all text is derived from Redux state; this
 * component holds no local state of its own.
 */

/**
 * External dependencies
 */
import { useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import { PlayerType, StateType } from '../types';

const BAR_COUNT = 28;
// Fixed (not random-per-render) heights so the bars don't jump around on
// every unrelated re-render — a small hand-picked wave pattern repeated.
const HEIGHT_PATTERN = [
	6, 10, 16, 22, 14, 8, 18, 26, 20, 12, 9, 15, 24, 30, 22, 14, 10, 17, 25,
	19, 11, 8, 16, 23, 13, 9, 14, 20,
];

export const TurnBar = () => {
	const currentPlayer = useSelector(
		( state: StateType ) => state.currentPlayer
	);
	const dice = useSelector( ( state: StateType ) => state.dice );
	const gameOver = useSelector( ( state: StateType ) => state.gameOver );

	let statusText = 'BAŞLAMAK İÇİN ZAR AT';
	if ( gameOver ) {
		statusText = 'OYUN BİTTİ';
	} else if ( currentPlayer === PlayerType.PLAYER_ONE ) {
		statusText = dice.length > 0 ? 'SIRA SENDE' : 'ZAR ATMA SIRASI SENDE';
	} else if ( currentPlayer === PlayerType.PLAYER_TWO ) {
		statusText = 'YAPAY ZEKA DÜŞÜNÜYOR...';
	}

	return (
		<div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center gap-2 py-2">
			<div className="flex items-end gap-[3px] h-8">
				{ HEIGHT_PATTERN.slice( 0, BAR_COUNT ).map( ( h, i ) => {
					const isLeftHalf = i < BAR_COUNT / 2;
					return (
						<span
							key={ i }
							className="w-[3px] rounded-full animate-pulse-glow"
							style={ {
								height: `${ h }px`,
								background: isLeftHalf ? '#ff2ec4' : '#28f4ff',
								animationDelay: `${ ( i % 7 ) * 0.12 }s`,
							} }
						/>
					);
				} ) }
			</div>
			<p className="font-display font-bold tracking-[0.2em] text-xs sm:text-sm text-white/85">
				{ statusText }
			</p>
		</div>
	);
};