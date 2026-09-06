/**
 * SelectionContext.tsx
 *
 * Cyber Tavla — transient checker-selection state.
 *
 * This is intentionally OUTSIDE Redux: it is ephemeral per-render UI state
 * (which checker/lane the human player has currently "picked up" on the
 * board), not part of the persisted game state. It supports a two-step
 * "select a checker, then confirm the destination" interaction — either by
 * tapping the highlighted destination lane directly, or by pressing the
 * HAMLE YAP button — matching the reference design's dedicated confirm
 * button. It resets freely on every turn change and never needs undo /
 * history / persistence the way the actual game state (checkers, dice,
 * scores, ...) does.
 */

import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';

type SelectionContextValue = {
	selectedLane: number | null;
	selectLane: ( lane: number | null ) => void;
	toggleLane: ( lane: number ) => void;
};

const SelectionContext = createContext< SelectionContextValue >( {
	selectedLane: null,
	selectLane: () => {},
	toggleLane: () => {},
} );

export const SelectionProvider = ( { children }: { children: ReactNode } ) => {
	const [ selectedLane, setSelectedLane ] = useState< number | null >( null );

	// Clicking the already-selected lane's checker again deselects it;
	// clicking a different one re-selects it.
	const toggleLane = ( lane: number ) =>
		setSelectedLane( ( current ) => ( current === lane ? null : lane ) );

	const value = useMemo(
		() => ( { selectedLane, selectLane: setSelectedLane, toggleLane } ),
		[ selectedLane ]
	);

	return (
		<SelectionContext.Provider value={ value }>
			{ children }
		</SelectionContext.Provider>
	);
};

export const useSelection = () => useContext( SelectionContext );