/**
 * Dice.tsx
 *
 * Cyber Tavla — the dice display. Replaces the old debug table + Roll/Flip/
 * Shift bootstrap buttons entirely. Purely displays the current dice as two
 * tilted glowing neon cubes (one magenta, one cyan) with classic dot-pip
 * faces, plus small extra pip indicators for doubles (3rd/4th bonus die).
 *
 * Clicking a die reorders the dice so that die becomes "active" (index 0),
 * since the underlying engine (see ../helpers/handleClickHelper.ts) always
 * consumes `dice[0]` as the die used for the next move — this lets the
 * player choose which of the two rolled numbers to play next when they
 * differ.
 *
 * Rolling itself now happens via the bottom "ZAR AT" action button (see
 * ActionBar.tsx) and the AI's own auto-roll (see GameFlowController.tsx),
 * NOT from this component.
 */

/**
 * External dependencies
 */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clsx } from 'clsx';

/**
 * Internal dependencies
 */
import { flipDice } from '../data/actions';
import { StateType } from '../types';

const PIP_LAYOUT: Record< number, number[] > = {
	1: [ 4 ],
	2: [ 0, 8 ],
	3: [ 0, 4, 8 ],
	4: [ 0, 2, 6, 8 ],
	5: [ 0, 2, 4, 6, 8 ],
	6: [ 0, 2, 3, 5, 6, 8 ],
};

const DieFace = ( {
	value,
	colorClass,
	glowClass,
	size = 'normal',
	tilt,
	onClick,
	clickable,
}: {
	value: number;
	colorClass: string;
	glowClass: string;
	size?: 'normal' | 'small';
	tilt: string;
	onClick?: () => void;
	clickable?: boolean;
} ) => {
	const dims =
		size === 'small' ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-12 h-12 sm:w-16 sm:h-16';
	const cells = PIP_LAYOUT[ value ] ?? [];

	return (
		<div
			className={ clsx(
				'relative grid grid-cols-3 grid-rows-3 gap-0.5 p-1.5 sm:p-2 rounded-lg border-2 bg-space-800/90',
				dims,
				glowClass,
				tilt,
				clickable && 'cursor-pointer hover:scale-105 transition-transform'
			) }
			onClick={ onClick }
		>
			{ Array.from( { length: 9 } ).map( ( _, i ) => (
				<span key={ i } className="flex items-center justify-center">
					{ cells.includes( i ) && (
						<span
							className={ clsx(
								'block rounded-full',
								size === 'small' ? 'w-1 h-1' : 'w-1.5 h-1.5 sm:w-2 sm:h-2',
								colorClass
							) }
							style={ {
								background: 'currentColor',
								boxShadow: '0 0 4px currentColor, 0 0 8px currentColor',
							} }
						/>
					) }
				</span>
			) ) }
		</div>
	);
};

export const Dice = () => {
	const dispatch = useDispatch();
	const dice = useSelector( ( state: StateType ) => state.dice );
	const gameOver = useSelector( ( state: StateType ) => state.gameOver );
	const [ isRolling, setIsRolling ] = useState( false );
	const prevDiceRef = useRef< string >( '' );

	useEffect( () => {
		const key = JSON.stringify( dice );
		if (
			prevDiceRef.current !== '' &&
			key !== prevDiceRef.current &&
			dice.length > 0
		) {
			setIsRolling( true );
			const t = setTimeout( () => setIsRolling( false ), 500 );
			return () => clearTimeout( t );
		}
		prevDiceRef.current = key;
	}, [ dice ] );

	useEffect( () => {
		prevDiceRef.current = JSON.stringify( dice );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	if ( dice.length === 0 ) {
		// Reserve layout space even when no dice are shown, so surrounding
		// elements don't jump when a roll appears.
		return <div className="h-16 sm:h-20" />;
	}

	const canFlip = dice.length === 2 && dice[ 0 ] !== dice[ 1 ] && ! gameOver;
	const bonusDice = dice.slice( 2 ); // present only for doubles (3rd/4th usable die)

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="flex items-center gap-4 sm:gap-6">
				<DieFace
					value={ dice[ 0 ] }
					colorClass="text-neon-magenta"
					glowClass="border-neon-magenta-glow"
					tilt={ clsx( '-rotate-6', isRolling && 'animate-tumble' ) }
					clickable={ canFlip }
					onClick={ canFlip ? () => dispatch( flipDice( dice ) ) : undefined }
				/>
				{ dice.length > 1 && (
					<DieFace
						value={ dice[ 1 ] }
						colorClass="text-neon-cyan"
						glowClass="border-neon-cyan-glow"
						tilt={ clsx( 'rotate-6', isRolling && 'animate-tumble' ) }
						clickable={ canFlip }
						onClick={ canFlip ? () => dispatch( flipDice( dice ) ) : undefined }
					/>
				) }
			</div>
			{ bonusDice.length > 0 && (
				<div className="flex items-center gap-2 opacity-80">
					{ bonusDice.map( ( d, i ) => (
						<DieFace
							key={ i }
							value={ d }
							colorClass={ i % 2 === 0 ? 'text-neon-magenta' : 'text-neon-cyan' }
							glowClass={
								i % 2 === 0
									? 'border-neon-magenta-glow'
									: 'border-neon-cyan-glow'
							}
							size="small"
							tilt=""
						/>
					) ) }
				</div>
			) }
		</div>
	);
};