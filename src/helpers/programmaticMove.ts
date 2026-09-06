/**
 * programmaticMove.ts
 *
 * Cyber Tavla — programmatic move adapter.
 *
 * `handleClick` (see ./handleClickHelper.ts) is the single, well-tested
 * source of truth for "try to move the checker on lane X using the current
 * die": it enforces bar precedence, blocked points, bear-off eligibility,
 * hit detection, notices, pip-count updates, win checks — everything. It was
 * written to be driven by a real DOM click event, from which it reads the
 * clicked lane via `event.target.closest('.lane').dataset.lane`.
 *
 * Two callers in this app need to trigger that exact same logic WITHOUT a
 * real mouse click on the board:
 *   - The "HAMLE YAP" button, which confirms a move the player has already
 *     prepared (by selecting a checker and a highlighted destination lane).
 *   - The AI opponent, which decides its destination lane programmatically
 *     via ../ai/backgammonAI.ts.
 *
 * Rather than reimplementing (and risking diverging from) the rules in
 * handleClickHelper.ts, both of those callers go through `performMove`
 * below, which fabricates a minimal fake event carrying just enough shape
 * for `handleClick` to read the target lane from, then delegates to the
 * real, tested function.
 */

/**
 * Internal dependencies
 */
import { handleClick } from './handleClickHelper';
import type { CheckerType, PlayerType } from '../types';

/**
 * Builds a minimal fake DOM click event that satisfies the only thing
 * `handleClick` ever reads off a real event:
 * `event.target.closest('.lane').dataset.lane`.
 *
 * @param {number} lane - The board lane to report as the click target.
 * @returns {{ target: { closest: () => { dataset: { lane: string } } } }}
 *   A plain object shaped like the DOM event `handleClick` expects.
 */
export const fakeLaneEvent = ( lane: number ) => ( {
	target: {
		closest: () => ( {
			dataset: { lane: String( lane ) },
		} ),
	},
} );

/**
 * Programmatically performs a move on `lane`, exactly as if the player had
 * clicked a checker sitting in that lane — without needing a real DOM
 * event. Used by the "HAMLE YAP" button and by the AI opponent so both
 * share the exact same move-validation/dispatch path as a real board click.
 *
 * @param {number} lane - The lane containing the checker to move.
 * @param {Object} ctx - The same context `handleClick` expects.
 * @param {number} ctx.id - The id of the checker being moved.
 * @param {PlayerType} ctx.player - The owning player of the checker.
 * @param {number[]} ctx.dice - The current dice array.
 * @param {PlayerType} ctx.currentPlayer - The player whose turn it is.
 * @param {CheckerType[]} ctx.checkers - The full current checkers array.
 * @param {number} ctx.die - The die value being used for this move.
 * @param {*} ctx.dispatch - The Redux dispatch function.
 */
export const performMove = (
	lane: number,
	ctx: {
		id: number;
		player: PlayerType;
		dice: number[];
		currentPlayer: PlayerType;
		checkers: CheckerType[];
		die: number;
		dispatch: any;
	}
): void => {
	handleClick( fakeLaneEvent( lane ), ctx );
};