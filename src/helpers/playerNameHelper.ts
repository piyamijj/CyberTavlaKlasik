/**
 * Internal dependencies
 */
import { PlayerType } from '../types';

/**
 * Returns a formatted player name.
 *
 * @param {PlayerType|null} playerType - The player type.
 * @returns {string} The formatted player name.
 */
export const getFormattedPlayerName = (
	playerType: PlayerType | null
): string => {
	if ( playerType === null ) {
		return 'Oyuncu seçilmedi';
	}

	return playerType === PlayerType.PLAYER_ONE
		? 'Oyuncu 1'
		: 'Yapay Zeka';
};

/**
 * Returns a formatted player name with an emoji prefix.
 *
 * @param {PlayerType|null} playerType - The player type.
 * @returns {string} The formatted player name with emoji.
 */
export const getFormattedPlayerNameWithEmoji = (
	playerType: PlayerType | null
): string => {
	if ( playerType === null ) {
		return 'Oyuncu seçilmedi';
	}

	return playerType === PlayerType.PLAYER_ONE
		? '1️⃣ Oyuncu 1'
		: '2️⃣ Yapay Zeka';
};
