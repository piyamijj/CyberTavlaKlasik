/**
 * Game.tsx
 *
 * Cyber Tavla — single top-level layout assembly for the whole game.
 * Wires together every piece into the full holographic layout matching the
 * reference image, top to bottom: Header (title), the two score panels
 * (human left / AI right), the turn/frequency bar, the dice, the 3D board
 * (flanked by decorative CircuitRails on wide screens), the notice toast,
 * and the bottom ActionBar — plus the MenuModal (conditionally shown) and
 * the always-mounted GameFlowController (AI + auto-pass + sound logic).
 *
 * `store` (../data/store) is unchanged from the original project — only
 * this file's layout/composition is new.
 */

/**
 * External dependencies
 */
import { useState } from 'react';
import { Provider, useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import { store } from '../data/store';
import { SelectionProvider } from '../context/SelectionContext';
import { GameFlowController } from './GameFlowController';
import { Header } from './Header';
import { ScorePanel } from './ScorePanel';
import { TurnBar } from './TurnBar';
import { Dice } from './Dice';
import { Board } from './Board';
import { CircuitRail } from './CircuitRail';
import { Notice } from './Notice';
import { ActionBar } from './ActionBar';
import { MenuModal } from './MenuModal';
import { PlayerType, StateType } from '../types';

const GameApp = () => {
	const scores = useSelector( ( state: StateType ) => state.scores );
	const currentPlayer = useSelector(
		( state: StateType ) => state.currentPlayer
	);
	const [ isMenuOpen, setIsMenuOpen ] = useState( false );

	return (
		<div className="min-h-screen w-full flex flex-col relative z-10">
			<Header />

			<div className="w-full max-w-3xl mx-auto px-3 sm:px-6 flex items-start justify-between gap-3">
				<ScorePanel
					side="left"
					colorClass="magenta"
					playerName="Oyuncu 1"
					score={ scores[ PlayerType.PLAYER_ONE ] }
					isActiveTurn={ currentPlayer === PlayerType.PLAYER_ONE }
					avatarKind="circuit"
				/>
				<ScorePanel
					side="right"
					colorClass="cyan"
					playerName="Yapay Zeka (Zor)"
					score={ scores[ PlayerType.PLAYER_TWO ] }
					isActiveTurn={ currentPlayer === PlayerType.PLAYER_TWO }
					avatarKind="brain"
				/>
			</div>

			<TurnBar />

			<Dice />

			<div className="flex-1 flex items-center justify-center gap-2 py-4">
				<CircuitRail side="left" />
				<Board />
				<CircuitRail side="right" />
			</div>

			<Notice />

			<ActionBar onOpenMenu={ () => setIsMenuOpen( true ) } />

			<MenuModal isOpen={ isMenuOpen } onClose={ () => setIsMenuOpen( false ) } />
		</div>
	);
};

export const Game = () => {
	return (
		<Provider store={ store }>
			<SelectionProvider>
				<GameFlowController />
				<GameApp />
			</SelectionProvider>
		</Provider>
	);
};