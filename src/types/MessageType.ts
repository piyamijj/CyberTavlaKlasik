// Bu metinler doğrudan bildirim (Notice) kutusunda oyuncuya gösterilir —
// enum üye adları (İngilizce) koda dahili referans olarak sabit kalır, tüm
// görünen METİN değerleri Türkçe'dir.
export enum MessageType {
	FINISHED_CHECKER = 'Oyundan çıkmış bir taşı tekrar oyuna sokamazsın!',
	MOVE_CHECKER = 'Taş hedef kareye taşındı.',
	MOVE_CHECKER_AND_HIT = 'Taş hedef kareye taşındı ve rakibi vurdu!',
	MOVE_CHECKER_TO_BOARD = 'Taş oyun tahtasına girdi.',
	MOVE_WAITING_CHECKER_AND_HIT = 'Bekleyen taş oyuna girdi ve rakibin taşını vurdu!',
	MUST_USE_LARGER_DIE = 'İki zarı da oynayamıyorsan büyük olan zarı kullanmalısın.',
	NO_VALID_MOVES = 'Oynanabilecek hamle yok — sıra rakibe geçti.',
	NOT_YOUR_CHECKER = 'Bu senin taşın değil.',
	NOT_ALL_CHECKERS_IN_END_ZONE = 'Taş çıkarabilmek için tüm taşların iç tahtada olması gerekir.',
	TARGET_OCCUPIED_BY_OPPONENT = 'Hedef kare rakibin taşlarıyla dolu.',
	ROLL_DICE_FIRST = 'Önce zar atmalısın.',
	WAITING_CHECKER = 'Önce bardaki bekleyen taşını oynamalısın.',
	WELCOME = "Cyber Tavla'ya hoş geldin!",
	PLAYER_TWO_WINS = 'Yapay Zeka kazandı!',
	PLAYER_ONE_WINS = 'Oyuncu 1 kazandı!',
	PLAYER_SURRENDERED = 'Oyuncu oyunu bıraktı.',
	GAME_RESTARTED = 'Oyun yeniden başladı. Bol şans!',
	MOVE_UNDONE = 'Son hamle geri alındı.',
	NO_MOVES_TO_UNDO = 'Geri alınacak hamle yok.',
}
