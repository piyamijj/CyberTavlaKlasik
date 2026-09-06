/**
 * Notice.tsx
 *
 * Cyber Tavla — floating holographic toast for the current `state.notice`.
 * Replaces the old react-bootstrap `<Alert>`; the underlying data flow is
 * unchanged, this file only changes the visual presentation.
 */

/**
 * External dependencies
 */
import { useSelector } from 'react-redux';
import { clsx } from 'clsx';

/**
 * Internal dependencies
 */
import { StateType, NoticeStatusType } from '../types';

export const Notice = () => {
	const notice = useSelector( ( state: StateType ) => state.notice );

	const styleByStatus: Record< string, string > = {
		[ NoticeStatusType.ERROR ]: 'border-neon-magenta-glow text-neon-magenta',
		[ NoticeStatusType.INFO ]: 'border-neon-cyan-glow text-neon-cyan',
		[ NoticeStatusType.SUCCESS ]: 'border-neon-cyan-glow text-white',
	};

	return (
		<div className="w-full max-w-xl mx-auto px-4 min-h-[2.5rem] flex items-center justify-center">
			<div
				key={ notice.message }
				className={ clsx(
					'glass-panel rounded-full border px-4 py-1.5 text-xs sm:text-sm font-body text-center animate-pop-in',
					styleByStatus[ notice.status ] ?? 'border-white/20 text-white/80'
				) }
			>
				{ notice.message }
			</div>
		</div>
	);
};