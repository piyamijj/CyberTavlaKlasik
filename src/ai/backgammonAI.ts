/**
 * backgammonAI.ts
 *
 * Cyber Tavla — "YAPAY ZEKA (ZOR)" AI opponent move-selection brain.
 *
 * This module decides WHICH legal move the AI should make each sub-turn.
 * It never dispatches anything itself and has no side effects — it is a
 * pure decision function. The caller (see ../components/GameFlowController)
 * is responsible for actually executing the chosen move via the existing,
 * already-tested `handleClick` path (see ../helpers/programmaticMove.ts),
 * so the AI's moves are validated and applied through exactly the same
 * code path as a real human board click.
 *
 * Every candidate move considered here is built from the already-tested
 * `getAvailableLanes` selector (see ../data/selectors.ts), so bar
 * precedence, blocked points, the must-use-larger-die rule, and bear-off
 * eligibility are all pre-enforced there — this module never has to
 * re-implement or risk diverging from those rules. Its only job is to
 * RANK the legal candidates with a backgammon strategy heuristic so the AI
 * plays at a credible "hard" difficulty:
 *
 *   1. Enter from the bar whenever a checker is waiting there.
 *   2. Bear off whenever eligible.
 *   3. Hit an opponent's blot whenever possible.
 *   4. Land on your own checker(s) to make or keep a point, rather than
 *      landing alone and creating a new blot.
 *   5. Avoid breaking an existing made point (a 2-checker stack) into a
 *      new blot unless a stronger bonus above justifies it.
 */

/**
 * Internal dependencies
 */
import type { CheckerType } from '../types';
import { PlayerType } from '../types';
import { getAvailableLanes } from '../data/selectors';

/**
 * The AI's chosen move for one sub-turn (i.e. for using one die).
 */
export type AIMoveDecision = {
	lane: number;
	id: number;
	die: number;
	target: number;
};

/**
 * Scores one candidate move from `currentPlayer`'s perspective. Higher is
 * better. This is the AI's entire "strategy" — see the file header for the
 * rules it encodes.
 *
 * @param {CheckerType[]} checkers - The full current checkers array (before the move).
 * @param {PlayerType} currentPlayer - The player the AI is deciding for.
 * @param {number} lane - The candidate source lane.
 * @param {number} die - The die value that produces this candidate.
 * @param {number} target - The resulting target lane for this candidate.
 *
 * @returns {number} A heuristic score; higher means a more desirable move.
 */
const scoreCandidate = (
	checkers: CheckerType[],
	currentPlayer: PlayerType,
	lane: number,
	die: number,
	target: number
): number => {
	// Mild bias toward using the larger die when candidates are otherwise
	// equal — all else being equal, more pip progress is better.
	let score = die;

	const opponent =
		currentPlayer === PlayerType.PLAYER_ONE
			? PlayerType.PLAYER_TWO
			: PlayerType.PLAYER_ONE;
	const borneOffLane = currentPlayer === PlayerType.PLAYER_ONE ? 25 : 0;
	const barLane = currentPlayer === PlayerType.PLAYER_ONE ? 0 : 25;

	const isBearOff = target === borneOffLane;
	if ( isBearOff ) {
		// Bearing off is always great progress.
		score += 60;
	}

	const wasOnBar = lane === barLane;
	if ( wasOnBar ) {
		// Re-entering from the bar is high priority — it's usually the only
		// legal move anyway when a checker is on the bar.
		score += 40;
	}

	if ( ! isBearOff ) {
		// Hitting a blot is very strong in backgammon — it sends the
		// opponent's checker to the bar and costs them significant tempo.
		const opponentsAtTarget = checkers.filter(
			( c ) => c.player === opponent && c.lane === target
		).length;
		if ( opponentsAtTarget === 1 ) {
			score += 45;
		}

		// Landing on your own checker(s) is safe and makes/keeps a point.
		// Landing alone creates a new blot, which is mildly discouraged.
		const ownAtTarget = checkers.filter(
			( c ) => c.player === currentPlayer && c.lane === target
		).length;
		if ( ownAtTarget >= 1 ) {
			score += 18;
		} else {
			score -= 5;
		}
	}

	if ( ! wasOnBar ) {
		// Moving one checker off a made 2-stack point breaks it into a
		// blot — discouraged unless the bonuses above (e.g. a hit or a
		// bear-off) outweigh it.
		const ownAtSource = checkers.filter(
			( c ) => c.player === currentPlayer && c.lane === lane
		).length;
		if ( ownAtSource === 2 ) {
			score -= 10;
		}
	}

	return score;
};

/**
 * Chooses the AI's best legal move for the current dice, given the current
 * board position. Only ranks moves that `getAvailableLanes` already
 * confirms are rules-legal (bar precedence, blocked points, must-use-
 * larger-die, and bear-off eligibility are all pre-enforced there).
 *
 * @param {CheckerType[]} checkers - The full current checkers array.
 * @param {PlayerType} currentPlayer - The player the AI is deciding for (normally PLAYER_TWO).
 * @param {number[]} dice - The current dice array.
 *
 * @returns {AIMoveDecision | null} The best move found, or `null` if the AI
 *   has no legal move at all with the current dice (the caller should then
 *   let the shared no-valid-move effect pass the turn).
 *
 * @example
 *
 * const decision = chooseAIMove( checkers, PlayerType.PLAYER_TWO, [ 4, 6 ] );
 * if ( decision ) {
 *   // execute decision.lane -> decision.target using decision.die
 * }
 */
export const chooseAIMove = (
	checkers: CheckerType[],
	currentPlayer: PlayerType,
	dice: number[]
): AIMoveDecision | null => {
	if ( dice.length === 0 ) {
		return null;
	}

	const borneOffLane = currentPlayer === PlayerType.PLAYER_ONE ? 25 : 0;

	const ownLanes = Array.from(
		new Set(
			checkers
				.filter(
					( c ) =>
						c.player === currentPlayer && c.lane !== borneOffLane
				)
				.map( ( c ) => c.lane )
		)
	);

	const candidates: Array< {
		lane: number;
		die: number;
		target: number;
		score: number;
	} > = [];

	ownLanes.forEach( ( lane ) => {
		const moves = getAvailableLanes( {
			dice,
			lane,
			checkers,
			currentPlayer,
		} );

		Object.keys( moves ).forEach( ( dieKey ) => {
			const die = Number( dieKey );
			const target = moves[ die ];
			candidates.push( {
				lane,
				die,
				target,
				score: scoreCandidate( checkers, currentPlayer, lane, die, target ),
			} );
		} );
	} );

	if ( candidates.length === 0 ) {
		return null;
	}

	candidates.sort( ( a, b ) => b.score - a.score );
	const best = candidates[ 0 ];

	const checker = checkers.find(
		( c ) => c.player === currentPlayer && c.lane === best.lane
	);
	if ( ! checker ) {
		return null;
	}

	return {
		lane: best.lane,
		id: checker.id,
		die: best.die,
		target: best.target,
	};
};