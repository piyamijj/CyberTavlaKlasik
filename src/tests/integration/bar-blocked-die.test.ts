// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { handleClick } from '../../helpers/handleClickHelper';
import { ActionTypes, PlayerType } from '../../types';
import type { CheckerType } from '../../types';

const eventForLane = ( lane: number ) => ( {
	target: {
		closest: vi.fn().mockReturnValue( {
			dataset: { lane: String( lane ) },
		} ),
	},
} );

describe( 'bar re-entry with one blocked die (regression)', () => {
	it( 'consumes only the die actually played, not dice[0], when entering with the non-blocked die', () => {
		// Player One has a checker on the bar. Die 2 would enter on lane 23,
		// which is blocked by 2+ opponent checkers. Die 5 enters on lane 20,
		// which is open. Dice are rolled as [2, 5] — the *blocked* die sits
		// at index 0, which is exactly the arrangement that reproduced the
		// bug (the old code did `dice.shift()`, always removing index 0
		// regardless of which die was actually used).
		const checkers: CheckerType[] = [
			{ id: 1, player: PlayerType.PLAYER_ONE, lane: 0 }, // on the bar
			{ id: 2, player: PlayerType.PLAYER_TWO, lane: 23 },
			{ id: 3, player: PlayerType.PLAYER_TWO, lane: 23 }, // blocks die=2
		];

		const dispatched: any[] = [];
		const dispatch = ( a: any ) => {
			dispatched.push( a );
			return a;
		};

		handleClick( eventForLane( 0 ), {
			id: 1,
			player: PlayerType.PLAYER_ONE,
			dice: [ 2, 5 ],
			currentPlayer: PlayerType.PLAYER_ONE,
			checkers,
			die: 5,
			dispatch,
		} );

		// The move must have gone through (checker moved off the bar).
		const moveAction = dispatched.find(
			( a ) => a.type === ActionTypes.MOVE_CHECKER
		);
		expect( moveAction ).toBeDefined();
		const movedChecker = moveAction.checkers.find(
			( c: CheckerType ) => c.id === 1
		);
		expect( movedChecker.lane ).toBe( 20 ); // 25 - 5

		// Only the played die (5) must be removed. The blocked die (2) must
		// remain as the sole remaining die — NOT [5] again, which is what
		// the old `dice.shift()` bug produced (letting 5 be replayed as if
		// it were a double).
		const setDiceAction = dispatched.find(
			( a ) => a.type === ActionTypes.SET_DICE
		);
		expect( setDiceAction ).toBeDefined();
		expect( setDiceAction.dice ).toEqual( [ 2 ] );
	} );

	it( 'consumes only the die actually played when the blocked die is dice[1] (order-independence sanity check)', () => {
		const checkers: CheckerType[] = [
			{ id: 1, player: PlayerType.PLAYER_ONE, lane: 0 },
			{ id: 2, player: PlayerType.PLAYER_TWO, lane: 23 },
			{ id: 3, player: PlayerType.PLAYER_TWO, lane: 23 },
		];

		const dispatched: any[] = [];
		const dispatch = ( a: any ) => dispatched.push( a );

		handleClick( eventForLane( 0 ), {
			id: 1,
			player: PlayerType.PLAYER_ONE,
			dice: [ 5, 2 ],
			currentPlayer: PlayerType.PLAYER_ONE,
			checkers,
			die: 5,
			dispatch,
		} );

		const setDiceAction = dispatched.find(
			( a: any ) => a.type === ActionTypes.SET_DICE
		);
		expect( setDiceAction.dice ).toEqual( [ 2 ] );
	} );
} );