/**
 * useAvailableTargets.ts
 *
 * Cyber Tavla — resolves the currently selected checker's legal destinations.
 *
 * Combines the transient selection state (../context/SelectionContext) with
 * the already-tested `getAvailableLanes` selector (../data/selectors) to
 * answer: "given the checker the player currently has selected, which
 * destination lanes are legal right now, and with which die?"
 *
 * The returned value is a map from die value to the legal target lane
 * reachable from the selected source lane with that die — it mirrors
 * `getAvailableLanes` exactly (bar precedence, blocked points, the
 * must-use-larger-die rule, and bear-off eligibility are all already
 * enforced there). Board components use this map to:
 *   (a) highlight the legal destination lanes on the board, and
 *   (b) let the HAMLE YAP button / a destination-lane click resolve which
 *       die to actually use when committing the move.
 */

import { useSelector } from 'react-redux';
import { useSelection } from '../context/SelectionContext';
import { getAvailableLanes } from '../data/selectors';
import type { StateType } from '../types';

export const useAvailableTargets = (): { [ die: number ]: number } => {
	const { selectedLane } = useSelection();
	const dice = useSelector( ( state: StateType ) => state.dice );
	const checkers = useSelector( ( state: StateType ) => state.checkers );
	const currentPlayer = useSelector(
		( state: StateType ) => state.currentPlayer
	);

	if ( selectedLane === null || currentPlayer === null ) {
		return {};
	}

	return getAvailableLanes( { dice, lane: selectedLane, checkers, currentPlayer } );
};