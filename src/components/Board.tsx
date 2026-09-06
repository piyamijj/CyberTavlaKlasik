/**
 * Board.tsx
 *
 * Cyber Tavla — the physical board itself, restyled as a 3D tilted glass
 * slab resting inside a dark holographic device console (see
 * `.hologram-device` and `.tilt-board` in ../index.css
 * for the console bezel, 3D perspective, and board-tilt transform).
 *
 * This file is purely layout/chrome — all checker rendering, stacking,
 * selection highlighting and move-confirmation logic lives in `<Lane>`
 * (see ./Lane.tsx). The four `<Lane>` elements per row below, and their
 * from/to/bar/off/player props, are unchanged from the original project:
 * only the surrounding visual structure is new.
 */

/**
 * Internal dependencies
 */
import { Lane } from './Lane';
import { PlayerType } from '../types';

export const Board = () => {
	return (
		<div className="w-full max-w-3xl mx-auto select-none">
			<div className="hologram-device p-3 sm:p-5 pb-8">
				{ /* subtle top edge highlight strip suggesting a glass bezel */ }
				<div className="h-1 w-2/3 mx-auto mb-3 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

				<div className="tilt-board rounded-xl bg-space-900/70 border border-white/5 p-2 sm:p-3 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]">
					<div className="flex">
						<Lane from={ 13 } to={ 18 } />
						<Lane
							from={ 25 }
							to={ 25 }
							bar={ PlayerType.PLAYER_TWO }
							player={ PlayerType.PLAYER_TWO }
						/>
						<Lane from={ 19 } to={ 24 } />
						<Lane from={ 0 } to={ 0 } off={ PlayerType.PLAYER_TWO } />
					</div>

					{ /* thin glowing centre divider suggesting the board's spine/hinge */ }
					<div className="h-px my-1 sm:my-2 bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />

					<div className="flex">
						<Lane from={ 12 } to={ 7 } />
						<Lane
							from={ 0 }
							to={ 0 }
							bar={ PlayerType.PLAYER_ONE }
							player={ PlayerType.PLAYER_ONE }
						/>
						<Lane from={ 6 } to={ 1 } />
						<Lane from={ 25 } to={ 25 } off={ PlayerType.PLAYER_ONE } />
					</div>
				</div>
			</div>
		</div>
	);
};