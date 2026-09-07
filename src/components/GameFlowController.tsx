/**
 * GameFlowController.tsx
 *
 * Cyber Tavla — render-nothing "engine glue" component mounted once inside
 * the Redux `<Provider>`. It reacts to state changes only (no props) and
 * has four responsibilities:
 *
 *   1. Auto-pass when no legal move exists — for BOTH players, at any
 *      point in a turn (not just turn start).
 *   2. AI auto-roll — the AI (PLAYER_TWO) rolls its own dice shortly after
 *      it becomes its turn.
 *   3. AI auto-move — the AI chooses and plays a move shortly after dice
 *      are available on its turn, reusing the exact same tested move path
 *      a human click would use (see ../helpers/programmaticMove.ts).
 *   4. Sound effects on notice change — plays the matching synthesized
 *      sound whenever `state.notice` changes (hits, moves, errors, wins),
 *      skipping the very first (mount-time) notice so nothing plays before
 *      any user gesture.
 *
 * This component renders nothing (`return null`) — it exists purely to
 * react to state changes.
 */

/**
 * External dependencies
 */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import { checkAndHandleNoValidMoves } from '../helpers/noValidMovesHelper';
import { performMove } from '../helpers/programmaticMove';
import { chooseAIMove } from '../ai/backgammonAI';
import { rollDice } from '../data/actions';
import {
	playDiceRoll,
	playError,
	playHit,
	playMove,
	playNotify,
	playWin,
} from '../audio/soundManager';
import { MessageType, NoticeStatusType, PlayerType, StateType } from '../types';

const AI_PLAYER = PlayerType.PLAYER_TWO;
const AI_ROLL_DELAY_MS = 500;
const AI_THINK_DELAY_MS = 650;

export const GameFlowController = () => {
	const dispatch = useDispatch();
	const dice = useSelector( ( s: StateType ) => s.dice );
	const checkers = useSelector( ( s: StateType ) => s.checkers );
	const currentPlayer = useSelector( ( s: StateType ) => s.currentPlayer );
	const gameOver = useSelector( ( s: StateType ) => s.gameOver );
	const notice = useSelector( ( s: StateType ) => s.notice );

	const hasHandledFirstNoticeRef = useRef( false );

	// --- 1. Auto-pass when no legal move exists (both players, any time) ----
	useEffect( () => {
		if ( gameOver || currentPlayer === null || dice.length === 0 ) return;
		checkAndHandleNoValidMoves( { dispatch, checkers, dice, currentPlayer } );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ dice, checkers, currentPlayer, gameOver ] );

	// --- 2. AI auto-roll ------------------------------------------------------
	useEffect( () => {
		if ( gameOver || currentPlayer !== AI_PLAYER || dice.length > 0 ) return;
		const t = setTimeout( () => {
			playDiceRoll();
			dispatch( rollDice() );
		}, AI_ROLL_DELAY_MS );
		return () => clearTimeout( t );
	}, [ currentPlayer, dice.length, gameOver, dispatch ] );

	// --- 3. AI auto-move -------------------------------------------------------
	useEffect( () => {
		if ( gameOver || currentPlayer !== AI_PLAYER || dice.length === 0 ) return;
		const t = setTimeout( () => {
			const decision = chooseAIMove( checkers, currentPlayer, dice );
			if ( ! decision ) return;

			// The engine now removes the exact die value played (see
			// `consumeDie` in ../helpers/handleClickHelper.ts), so the dice
			// array can be passed through as-is regardless of which index
			// `decision.die` sits at — no reordering/flipping needed.
			performMove( decision.lane, {
				id: decision.id,
				player: currentPlayer,
				dice,
				currentPlayer,
				checkers,
				die: decision.die,
				dispatch,
			} );
		}, AI_THINK_DELAY_MS );
		return () => clearTimeout( t );
	}, [ currentPlayer, dice, checkers, gameOver, dispatch ] );

	// --- 4. Sound effects on notice change -------------------------------------
	useEffect( () => {
		if ( ! hasHandledFirstNoticeRef.current ) {
			hasHandledFirstNoticeRef.current = true;
			return;
		}

		const { message, status } = notice;

		if (
			message === MessageType.PLAYER_ONE_WINS ||
			message === MessageType.PLAYER_TWO_WINS ||
			message === MessageType.PLAYER_SURRENDERED
		) {
			playWin();
		} else if (
			message === MessageType.MOVE_CHECKER_AND_HIT ||
			message === MessageType.MOVE_WAITING_CHECKER_AND_HIT
		) {
			playHit();
		} else if (
			message === MessageType.MOVE_CHECKER ||
			message === MessageType.MOVE_CHECKER_TO_BOARD
		) {
			playMove();
		} else if ( status === NoticeStatusType.ERROR ) {
			playError();
		} else if ( status === NoticeStatusType.INFO ) {
			playNotify();
		}
	}, [ notice ] );

	return null;
};