/**
 * Internal dependencies
 */
import { setNotice } from '../data/actions';
import {
	hasDiceBeenRolled,
	isCurrentPlayer,
	hasWaitingChecker,
	isCheckerClearedOff,
	isTargetOccupiedByOtherPlayer,
	willHitOpponent,
	getTargetLane,
	getHitCheckerId,
	hasCheckersOutsideHomeBoard,
	wouldClearOffChecker,
} from '../data/selectors';
import { MessageType, NoticeStatusType, PlayerType } from '../types';
import { checkForWin } from './checkForWinHelper';
import { createNotice } from './createNoticeHelper';
import { updateGame } from './updateGameHelper';
import { validateDiceUse } from './validateMoveHelper';

/**
 * Removes exactly one occurrence of the die value that was just played from
 * the dice array, in place.
 *
 * Bug fix: the die actually used to make a move is not always `dice[0]` —
 * e.g. entering from the bar, or the "must use the larger die" rule, can
 * both require playing `dice[1]`. Blindly calling `dice.shift()` removed
 * whatever sat at index 0 instead of the die that was truly consumed, which
 * could leave the *used* die still sitting in the array (making it playable
 * again — effectively "using" the same die twice) while silently dropping
 * the *other, unplayed* die. Removing the specific value played fixes this
 * for both single-die and double-die (four-of-a-kind) rolls.
 */
const consumeDie = ( dice: number[], die: number ): void => {
	const index = dice.indexOf( die );
	if ( index !== -1 ) {
		dice.splice( index, 1 );
	}
};

/**
 * Handles the click event on a game board lane.
 *
 * @param event - The click event object.
 * @param id - The ID of the clicked lane.
 * @param player - The player object.
 * @param dice - The array of dice values.
 * @param currentPlayer - The current player.
 * @param checkers - The array of checkers on the board.
 * @param die - The current die value.
 * @param dispatch - The dispatch function for updating the game state.
 */
export const handleClick = (
	event: any,
	{ id, player, dice, currentPlayer, checkers, die, dispatch }: any
) => {
	const lane = parseInt( event.target.closest( '.lane' ).dataset.lane );
	const targetLane = getTargetLane( { currentPlayer, lane, die } );
	const newCheckers = JSON.parse( JSON.stringify( checkers ) );
	const newDice = [ ...dice ];
	const playerObject = { checkers, currentPlayer, lane, die };

	if ( ! hasDiceBeenRolled( dice ) ) {
		return dispatch(
			setNotice(
				createNotice(
					NoticeStatusType.ERROR,
					MessageType.ROLL_DICE_FIRST
				)
			)
		);
	}

	if ( ! isCurrentPlayer( { player, currentPlayer } ) ) {
		return dispatch(
			setNotice(
				createNotice(
					NoticeStatusType.ERROR,
					MessageType.NOT_YOUR_CHECKER
				)
			)
		);
	}

	if ( ! validateDiceUse( { dice, checkers, currentPlayer, die } ) ) {
		return dispatch(
			setNotice(
				createNotice(
					NoticeStatusType.ERROR,
					MessageType.MUST_USE_LARGER_DIE
				)
			)
		);
	}

	if ( isCheckerClearedOff( { lane, currentPlayer } ) ) {
		return dispatch(
			setNotice(
				createNotice(
					NoticeStatusType.ERROR,
					MessageType.FINISHED_CHECKER
				)
			)
		);
	}

	// If player has a checker on the bar, they must move it first
	if ( hasWaitingChecker( { checkers, currentPlayer } ) ) {
		// If trying to move a checker that's not on the bar
		if ( lane !== 0 && lane !== 25 ) {
			return dispatch(
				setNotice(
					createNotice(
						NoticeStatusType.ERROR,
						MessageType.WAITING_CHECKER
					)
				)
			);
		}
	}

	if ( isTargetOccupiedByOtherPlayer( playerObject ) ) {
		return dispatch(
			setNotice(
				createNotice(
					NoticeStatusType.ERROR,
					MessageType.TARGET_OCCUPIED_BY_OPPONENT
				)
			)
		);
	}

	if (
		hasWaitingChecker( { checkers, currentPlayer } ) &&
		willHitOpponent( { checkers, currentPlayer, lane, die } )
	) {
		const hitCheckerId = getHitCheckerId( { checkers, lane: targetLane } );

		if ( hitCheckerId === undefined ) {
			throw new Error( 'No checker found on target lane' );
		}

		newCheckers[ hitCheckerId - 1 ].lane =
			currentPlayer === PlayerType.PLAYER_ONE ? 25 : 0;
		newCheckers[ id - 1 ].lane = targetLane;
		consumeDie( newDice, die );

		const notice = createNotice(
			NoticeStatusType.SUCCESS,
			MessageType.MOVE_WAITING_CHECKER_AND_HIT
		);

		updateGame( dispatch, newCheckers, newDice, notice, currentPlayer );
		checkForWin( dispatch, newCheckers, currentPlayer );
		return;
	}

	if ( hasWaitingChecker( { checkers, currentPlayer } ) ) {
		newCheckers[ id - 1 ].lane = targetLane;
		consumeDie( newDice, die );

		const notice = createNotice(
			NoticeStatusType.SUCCESS,
			MessageType.MOVE_CHECKER_TO_BOARD
		);

		updateGame( dispatch, newCheckers, newDice, notice, currentPlayer );
		checkForWin( dispatch, newCheckers, currentPlayer );
		return;
	}

	if ( willHitOpponent( { checkers, currentPlayer, lane, die } ) ) {
		const hitCheckerId = getHitCheckerId( { checkers, lane: targetLane } );

		if ( hitCheckerId === undefined ) {
			throw new Error( 'No checker found on target lane' );
		}

		newCheckers[ hitCheckerId - 1 ].lane = currentPlayer === PlayerType.PLAYER_ONE ? 25 : 0; // prettier-ignore
		newCheckers[ id - 1 ].lane = targetLane;
		consumeDie( newDice, die );

		const notice = createNotice(
			NoticeStatusType.SUCCESS,
			MessageType.MOVE_CHECKER_AND_HIT
		);

		updateGame( dispatch, newCheckers, newDice, notice, currentPlayer );
		checkForWin( dispatch, newCheckers, currentPlayer );
		return;
	}

	// Check if attempting to bear off when checkers are outside home board.
	// Bearing off is only allowed when ALL checkers are in the home board.
	// P1's borne-off lane is 25, P2's is 0. (Lanes 0/25 are also the bars,
	// but the bar is the *source* of moves, never the target.)
	const isBearingOff =
		( currentPlayer === PlayerType.PLAYER_ONE && targetLane === 25 ) ||
		( currentPlayer === PlayerType.PLAYER_TWO && targetLane === 0 );

	if ( isBearingOff && hasCheckersOutsideHomeBoard( { checkers, currentPlayer } ) ) {
		return dispatch(
			setNotice(
				createNotice(
					NoticeStatusType.ERROR,
					MessageType.NOT_ALL_CHECKERS_IN_END_ZONE
				)
			)
		);
	}

	// Check if attempting to bear off with higher die when checkers exist on higher points
	// This only applies when all checkers are in the home board
	if (
		isBearingOff &&
		! hasCheckersOutsideHomeBoard( { checkers, currentPlayer } ) &&
		! wouldClearOffChecker( { die, lane, currentPlayer, checkers } )
	) {
		// Attempting to bear off but wouldClearOffChecker returned false
		// This means either not exact and checkers exist on higher points, or invalid move
		return dispatch(
			setNotice(
				createNotice(
					NoticeStatusType.ERROR,
					MessageType.NOT_ALL_CHECKERS_IN_END_ZONE
				)
			)
		);
	}

	newCheckers[ id - 1 ].lane = targetLane;
	consumeDie( newDice, die );

	const notice = createNotice(
		NoticeStatusType.SUCCESS,
		MessageType.MOVE_CHECKER
	);

	updateGame( dispatch, newCheckers, newDice, notice, currentPlayer );
	checkForWin( dispatch, newCheckers, currentPlayer );
};
