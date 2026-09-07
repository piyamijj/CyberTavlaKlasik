/**
 * External dependencies
 */
import { clsx } from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import { Checker } from './Checker';
import { useSelection } from '../context/SelectionContext';
import { useAvailableTargets } from '../hooks/useAvailableTargets';
import { performMove } from '../helpers/programmaticMove';
import { playMove } from '../audio/soundManager';
import type { LaneType, StateType } from '../types';

export const Lane = ( {
	from,
	to,
	player,
	bar,
	off,
}: LaneType ): JSX.Element => {
	const checkers = useSelector( ( state: StateType ) => state.checkers );
	const currentPlayer = useSelector(
		( state: StateType ) => state.currentPlayer
	);
	const dice = useSelector( ( state: StateType ) => state.dice );
	const dispatch = useDispatch();
	const { selectedLane, selectLane } = useSelection();
	const availableTargets = useAvailableTargets();

	const lanes = [];

	const renderChecker = ( lane: number, keySuffix: string = '' ) => {
		const laneOwner = bar ? player : off ? off : undefined;
		const filteredCheckers = checkers.filter( ( item: any ) => {
			if ( item.lane !== lane ) return false;
			// Bar (lanes 0/25) and off (lanes 0/25) overlap — filter by owner
			// so a P1 checker on the bar (lane 0) isn't rendered in the P2 off
			// zone (also lane 0), and vice-versa.
			if ( laneOwner ) return item.player === laneOwner;
			if ( keySuffix ) return item.player === player;
			return true;
		} );
		const isStackedLane = ! bar && ! off;
		const maxVisible = 5;
		const visibleCheckers =
			isStackedLane && filteredCheckers.length > maxVisible
				? filteredCheckers.slice( 0, maxVisible )
				: filteredCheckers;
		// Lanes 1–12 sit on the bottom half (justify-content: flex-end), so
		// the innermost (toward board center) checker is index 0. Lanes 13–24
		// sit on the top half (flex-start), where the innermost is the last.
		const isBottomLane = lane >= 1 && lane <= 12;
		const overflowIndex = isBottomLane ? 0 : maxVisible - 1;
		const checkerElements = visibleCheckers.map(
			( item: any, index: number ) => (
				<Checker
					className="checker"
					id={ item.id }
					key={ item.id }
					player={ item.player }
					lane={ lane }
					count={
						isStackedLane &&
						filteredCheckers.length > maxVisible &&
						index === overflowIndex
							? filteredCheckers.length
							: undefined
					}
				/>
			)
		);
		const key = keySuffix ? `${ player }-${ lane }` : lane.toString();

		const isEven = lane % 2 === 0;
		const isDestination = Object.values( availableTargets ).includes( lane );
		const dieKey = Object.keys( availableTargets ).find(
			( k ) => availableTargets[ Number( k ) ] === lane
		);

		const handleLaneClick = () => {
			if ( ! isDestination || dieKey === undefined || selectedLane === null ) {
				return;
			}
			const moverChecker = checkers.find(
				( c: any ) => c.player === currentPlayer && c.lane === selectedLane
			);
			if ( ! moverChecker || currentPlayer === null ) {
				return;
			}
			playMove();
			performMove( selectedLane, {
				id: moverChecker.id,
				player: currentPlayer,
				dice,
				currentPlayer,
				checkers,
				die: Number( dieKey ),
				dispatch,
			} );
			selectLane( null );
		};

		// Shared destination highlight, applied consistently across point /
		// bar / off lanes alike — bearing off and bar re-entry are both
		// legitimate "destinations" too (getAvailableLanes may resolve a
		// target to lane 0 or 25), not just ordinary 1-24 points.
		const destinationHighlight = isDestination && (
			<div className="absolute inset-0 pointer-events-none rounded-md ring-2 ring-white/60 animate-pulse-glow z-20" />
		);

		if ( bar ) {
			return (
				<div
					className={ clsx(
						'lane relative w-6 sm:w-8 mx-1 rounded-md glass-panel border border-white/10',
						'flex flex-col items-center justify-center gap-0.5 py-2 min-h-[120px]',
						isDestination && 'cursor-pointer'
					) }
					data-lane={ lane }
					data-bar={ bar }
					onClick={ isDestination ? handleLaneClick : undefined }
					key={ key }
				>
					{ destinationHighlight }
					{ /* No text label here — a narrow glowing slot, matching the
					   reference image's plain bar/handle gap with no caption. */ }
					<div className="relative z-10 flex flex-col items-center gap-1">
						{ checkerElements }
					</div>
				</div>
			);
		}

		if ( off ) {
			return (
				<div
					className={ clsx(
						'lane relative w-9 sm:w-10 rounded-md bg-black/30 border border-white/10',
						'flex flex-col items-center gap-0.5 py-1 min-h-[120px]',
						isDestination && 'cursor-pointer'
					) }
					data-lane={ lane }
					data-off={ off }
					onClick={ isDestination ? handleLaneClick : undefined }
					key={ key }
				>
					{ destinationHighlight }
					<span className="text-[9px] uppercase tracking-widest text-white/40 font-display">
						Çıkış
					</span>
					<div className="relative z-10 flex flex-col items-center gap-1">
						{ checkerElements }
					</div>
				</div>
			);
		}

		return (
			<div
				className={ clsx(
					'lane relative flex-1 flex flex-col px-0.5 min-h-[210px]',
					isBottomLane ? 'justify-end' : 'justify-start',
					isDestination && 'cursor-pointer'
				) }
				data-lane={ lane }
				onClick={ isDestination ? handleLaneClick : undefined }
				key={ key }
			>
				{ /* decorative neon triangle outline, alternating cyan/magenta, behind the checkers.
				   Two stacked shapes create a glowing "stroke": a bright, heavily-glowing
				   fill sits behind a slightly-inset dark fill, leaving only a bold, lit
				   outline visible — matching the reference image's thick neon points. */ }
				<div className="absolute inset-0 pointer-events-none">
					<div
						className={ isBottomLane ? 'triangle-point-up' : 'triangle-point-down' }
						style={ {
							background: isEven
								? 'rgba(40,244,255,0.4)'
								: 'rgba(255,46,196,0.4)',
							filter: `drop-shadow(0 0 3px ${ isEven ? '#28f4ff' : '#ff2ec4' }) drop-shadow(0 0 12px ${ isEven ? '#28f4ff' : '#ff2ec4' }) drop-shadow(0 0 22px ${ isEven ? 'rgba(40,244,255,0.7)' : 'rgba(255,46,196,0.7)' })`,
						} }
					/>
					<div
						className={ clsx(
							'absolute',
							isBottomLane ? 'triangle-point-up' : 'triangle-point-down'
						) }
						style={ { inset: '4px', background: '#0b0a17' } }
					/>
				</div>

				{ destinationHighlight }

				{ /* the actual stacked checkers, above the decorative triangle */ }
				<div
					className={ clsx(
						'relative z-10 flex flex-col gap-0.5',
						isBottomLane ? 'flex-col-reverse' : ''
					) }
				>
					{ checkerElements }
				</div>
			</div>
		);
	};

	// Render checker that are moving from one lane to another (if-state)
	// or render checker that are staying in the same lane (else-state)
	if ( from !== to ) {
		const range =
			from < to
				? Array.from( { length: to - from + 1 }, ( _, i ) => from + i )
				: Array.from( { length: from - to + 1 }, ( _, i ) => from - i );
		lanes.push( ...range.map( ( lane ) => renderChecker( lane ) ) );
	} else {
		lanes.push( renderChecker( from, `${ player }` ) );
	}

	return <>{ lanes }</>;
};