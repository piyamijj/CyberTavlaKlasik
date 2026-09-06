/**
 * ActionBar.tsx
 *
 * Cyber Tavla — the bottom row of three pill-shaped action buttons from the
 * reference image: "ZAR AT" (roll), "HAMLE YAP" (confirm the prepared
 * move), "MENÜ" (opens the menu modal). This is the primary control
 * surface for the human player (PLAYER_ONE); the AI (PLAYER_TWO) rolls and
 * moves itself automatically via GameFlowController.tsx.
 */

/**
 * External dependencies
 */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clsx } from 'clsx';

/**
 * Internal dependencies
 */
import { rollDice, rollOpeningDie } from '../data/actions';
import { performMove } from '../helpers/programmaticMove';
import { useSelection } from '../context/SelectionContext';
import { useAvailableTargets } from '../hooks/useAvailableTargets';
import { playClick, playDiceRoll, playMove } from '../audio/soundManager';
import { PlayerType, StateType } from '../types';

export const ActionBar = ( { onOpenMenu }: { onOpenMenu: () => void } ) => {
	const dispatch = useDispatch();
	const currentPlayer = useSelector(
		( state: StateType ) => state.currentPlayer
	);
	const dice = useSelector( ( state: StateType ) => state.dice );
	const gameOver = useSelector( ( state: StateType ) => state.gameOver );
	const checkers = useSelector( ( state: StateType ) => state.checkers );

	const { selectedLane, selectLane } = useSelection();
	const availableTargets = useAvailableTargets();

	const [ isRolling, setIsRolling ] = useState( false );

	const handleZarAt = () => {
		if ( gameOver ) {
			return;
		}

		if ( currentPlayer === null ) {
			// Classic backgammon opening roll — each player rolls one die,
			// higher goes first, ties re-roll (the reducer's ROLL_OPENING_DIE
			// case already implements tie-reroll and assigns both dice to the
			// winner's first turn).
			const v1 = Math.floor( Math.random() * 6 ) + 1;
			const v2 = Math.floor( Math.random() * 6 ) + 1;

			playDiceRoll();
			setIsRolling( true );

			setTimeout( () => {
				dispatch( rollOpeningDie( PlayerType.PLAYER_ONE, v1 ) );
				dispatch( rollOpeningDie( PlayerType.PLAYER_TWO, v2 ) );
				setIsRolling( false );
			}, 550 );

			return;
		}

		if ( currentPlayer === PlayerType.PLAYER_ONE && dice.length === 0 ) {
			playDiceRoll();
			dispatch( rollDice() );
		}
	};

	const handleHamleYap = () => {
		if (
			gameOver ||
			currentPlayer !== PlayerType.PLAYER_ONE ||
			selectedLane === null
		) {
			return;
		}

		const availableKeys = Object.keys( availableTargets );
		if ( availableKeys.length === 0 ) {
			return;
		}

		const preferredKey = String( dice[ 0 ] );
		const dieKey = availableKeys.includes( preferredKey )
			? preferredKey
			: availableKeys[ 0 ];

		const moverChecker = checkers.find(
			( c ) => c.player === PlayerType.PLAYER_ONE && c.lane === selectedLane
		);
		if ( ! moverChecker ) {
			return;
		}

		playMove();
		performMove( selectedLane, {
			id: moverChecker.id,
			player: PlayerType.PLAYER_ONE,
			dice,
			currentPlayer: PlayerType.PLAYER_ONE,
			checkers,
			die: Number( dieKey ),
			dispatch,
		} );
		selectLane( null );
	};

	const canRoll =
		! gameOver &&
		( currentPlayer === null ||
			( currentPlayer === PlayerType.PLAYER_ONE && dice.length === 0 ) );

	const canConfirmMove =
		! gameOver &&
		currentPlayer === PlayerType.PLAYER_ONE &&
		selectedLane !== null &&
		Object.keys( availableTargets ).length > 0;

	return (
		<div className="w-full flex items-center justify-center gap-3 sm:gap-5 px-4 py-4">
			<button
				className={ clsx(
					'pill-button border-neon-magenta-glow text-neon-magenta bg-space-800/70',
					isRolling && 'animate-pulse-glow'
				) }
				disabled={ ! canRoll }
				onClick={ handleZarAt }
			>
				Zar At
			</button>
			<button
				className="pill-button border-neon-cyan-glow text-neon-cyan bg-space-800/70"
				disabled={ ! canConfirmMove }
				onClick={ handleHamleYap }
			>
				Hamle Yap
			</button>
			<button
				className="pill-button border-white/30 text-white/80 bg-space-800/70"
				onClick={ () => {
					playClick();
					onOpenMenu();
				} }
			>
				Menü
			</button>
		</div>
	);
};