export type PieceType = 'k' | 'a' | 'e' | 'h' | 'r' | 'c' | 'p';
// k: King/Tướng/Soái, a: Advisor/Sĩ, e: Elephant/Tượng, h: Horse/Mã, r: Rook/Xe, c: Cannon/Pháo, p: Pawn/Tốt/Binh

export type PieceColor = 'red' | 'black';

export interface Piece {
  type: PieceType;
  color: PieceColor;
  id: string; // unique identifier for animations and keys
}

export interface Position {
  r: number; // 0 to 9
  c: number; // 0 to 8
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece | null;
  notation: string; // e.g., "Pháo 2 bình 5" or "P2-5"
  color: PieceColor;
  isCheck?: boolean;
  score?: number;
}

export type Board = (Piece | null)[][];

export type AILevel = 'easy' | 'medium' | 'hard' | 'expert';

export type GameMode = 'ai' | 'pvp';

export type GameResult = 'red_win' | 'black_win' | 'draw' | null;

export interface HintResult {
  from: Position;
  to: Position;
  score: number;
  reason: string;
  depth: number;
}

export interface PlayerStats {
  id: string;
  name: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  title: string;
  avatar: string;
  highestElo: number;
  streak: number;
  rankBadge: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  title: string; // e.g. "Đặc Cấp Đại Sư", "Quốc Tế Đại Sư", "Kỳ Thủ Quốc Gia"
  elo: number;
  wins: number;
  losses: number;
  winRate: number;
  avatar: string;
  isUser?: boolean;
}

export interface SavedGameState {
  board: Board;
  turn: PieceColor;
  moveHistory: Move[];
  capturedRed: Piece[];
  capturedBlack: Piece[];
  gameMode: GameMode;
  aiLevel: AILevel;
  playerColor: PieceColor;
  gameResult: GameResult;
  timerRed: number;
  timerBlack: number;
  timestamp: number;
}
