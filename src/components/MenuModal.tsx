/**
 * MenuModal.tsx
 *
 * Cyber Tavla — the modal opened by the "MENÜ" bottom button. A centered
 * glass-panel dialog (dark overlay behind it) offering: restart game,
 * surrender, undo last move, a sound on/off toggle, and a short classic-
 * rules reminder blurb. All actions dispatch the existing, already-tested
 * action creators — this component adds no new game logic, only UI.
 */

/**
 * External dependencies
 */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import { restartGame, surrenderGame, undoMove } from '../data/actions';
import { isSoundEnabled, setSoundEnabled, playClick } from '../audio/soundManager';
import { StateType } from '../types';

export const MenuModal = ( {
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
} ) => {
	const dispatch = useDispatch();
	const gameOver = useSelector( ( state: StateType ) => state.gameOver );
	const moveHistoryLength = useSelector(
		( state: StateType ) => state.moveHistory.length
	);
	const [ soundOn, setSoundOn ] = useState( isSoundEnabled() );

	if ( ! isOpen ) {
		return null;
	}

	const handle = ( action: () => void ) => {
		playClick();
		action();
		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
			onClick={ onClose }
		>
			<div
				className="glass-panel border-2 border-neon-cyan-glow rounded-2xl w-full max-w-sm p-5 sm:p-6 flex flex-col gap-3 animate-pop-in"
				onClick={ ( e ) => e.stopPropagation() }
			>
				<h2 className="font-display font-bold text-lg text-neon-cyan text-center tracking-widest mb-1">
					MENÜ
				</h2>

				<button
					className="pill-button border-neon-magenta-glow text-neon-magenta bg-space-800/70 w-full"
					onClick={ () => handle( () => dispatch( restartGame() ) ) }
				>
					Yeniden Başlat
				</button>

				<button
					className="pill-button border-white/30 text-white/80 bg-space-800/70 w-full disabled:opacity-30"
					disabled={ moveHistoryLength === 0 || gameOver }
					onClick={ () => handle( () => dispatch( undoMove() ) ) }
				>
					Son Hamleyi Geri Al
				</button>

				<button
					className="pill-button border-neon-cyan-glow text-neon-cyan bg-space-800/70 w-full disabled:opacity-30"
					disabled={ gameOver }
					onClick={ () => handle( () => dispatch( surrenderGame() ) ) }
				>
					Oyunu Bırak
				</button>

				<button
					className="pill-button border-white/30 text-white/80 bg-space-800/70 w-full"
					onClick={ () => {
						const next = ! soundOn;
						setSoundOn( next );
						setSoundEnabled( next );
						if ( next ) playClick();
					} }
				>
					Ses: { soundOn ? 'Açık' : 'Kapalı' }
				</button>

				<p className="text-white/50 text-xs leading-relaxed text-center mt-2 font-body">
					Klasik tavla kuralları geçerlidir: pas bölgesi (bar), taş
					çıkarma (bear-off), çift zar (double) ile 4 hamle ve ikiye
					katlama küpü desteklenir. Bir taşı seçip aydınlanan bir
					kareye dokunarak ya da &quot;Hamle Yap&quot; ile hareket
					ettirin.
				</p>

				<button
					className="text-white/40 text-xs uppercase tracking-widest mt-1 hover:text-white/70"
					onClick={ onClose }
				>
					Kapat
				</button>
			</div>
		</div>
	);
};