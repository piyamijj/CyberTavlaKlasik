/**
 * External dependencies
 */
import { clsx } from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import { setNotice } from '../data/actions';
import { createNotice } from '../helpers/createNoticeHelper';
import { useSelection } from '../context/SelectionContext';
import { playClick } from '../audio/soundManager';
import { MessageType, NoticeStatusType, PlayerType, StateType } from '../types';

export const Checker = ( props: {
	className: string;
	id: number;
	player: PlayerType;
	count?: number;
	lane: number;
} ) => {
	const { className, id, player, count, lane } = props;
	const dispatch = useDispatch();
	const dice = useSelector( ( state: StateType ) => state.dice );
	const currentPlayer = useSelector(
		( state: StateType ) => state.currentPlayer
	);
	const { selectedLane, toggleLane } = useSelection();

	const handleCheckerClick = () => {
		// No game in progress yet — nudge the player to roll first.
		if ( currentPlayer === null ) {
			return dispatch(
				setNotice(
					createNotice(
						NoticeStatusType.ERROR,
						MessageType.ROLL_DICE_FIRST
					)
				)
			);
		}

		// It's a turn, but the dice haven't been rolled yet this turn.
		if ( dice.length === 0 ) {
			return dispatch(
				setNotice(
					createNotice(
						NoticeStatusType.ERROR,
						MessageType.ROLL_DICE_FIRST
					)
				)
			);
		}

		// Not this player's checker.
		if ( player !== currentPlayer ) {
			return dispatch(
				setNotice(
					createNotice(
						NoticeStatusType.ERROR,
						MessageType.NOT_YOUR_CHECKER
					)
				)
			);
		}

		// Pick this checker's lane up (or put it back down if it was
		// already selected). Committing the actual move now happens by
		// tapping a highlighted destination lane, or the HAMLE YAP button.
		playClick();
		toggleLane( lane );
	};

	const isPlayerOne = player === PlayerType.PLAYER_ONE;
	const isSelected = selectedLane === lane;

	return (
		<div
			key={ id }
			className={ clsx(
				className,
				'relative flex items-center justify-center cursor-pointer',
				'w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-transform duration-150',
				isPlayerOne ? 'border-neon-magenta-glow' : 'border-neon-cyan-glow',
				isSelected && 'scale-110 animate-pulse-glow ring-2 ring-white/70 z-10'
			) }
			style={ {
				background: isPlayerOne
					? 'radial-gradient(circle at 35% 30%, #ff2ec4 0%, #7a0e5c 55%, #200414 100%)'
					: 'radial-gradient(circle at 35% 30%, #28f4ff 0%, #0b5e66 55%, #04191b 100%)',
			} }
			title={ `Checker ${ id }` }
			data-checker={ id }
			data-player={ player }
			data-lane={ lane }
			onClick={ handleCheckerClick }
		>
			<div
				className={ clsx(
					'absolute inset-0 rounded-full pointer-events-none circuit-texture',
					isPlayerOne ? 'text-neon-magenta' : 'text-neon-cyan'
				) }
			/>
			{ count !== undefined && (
				<span
					className="relative z-10 font-display font-bold text-xs text-white"
					style={ { textShadow: '0 1px 3px rgba(0,0,0,0.9)' } }
				>
					{ count }
				</span>
			) }
		</div>
	);
};