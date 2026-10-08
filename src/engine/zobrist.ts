import { Board, Piece, PieceColor, PieceType } from '../types/chess';
import { BOARD_COLS, BOARD_ROWS } from './rules';

// 90 squares * 14 piece types
const PIECE_INDEX_MAP: Record<string, number> = {
  'red-k': 0, 'red-a': 1, 'red-e': 2, 'red-h': 3, 'red-r': 4, 'red-c': 5, 'red-p': 6,
  'black-k': 7, 'black-a': 8, 'black-e': 9, 'black-h': 10, 'black-r': 11, 'black-c': 12, 'black-p': 13,
};

// Seeded pseudorandom generator for deterministic Zobrist keys
let seed = 1073741827;
function nextRandom(): number {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed;
}

// 90 x 14 table
const ZOBRIST_TABLE: number[][] = [];
for (let sq = 0; sq < BOARD_ROWS * BOARD_COLS; sq++) {
  const row: number[] = [];
  for (let pt = 0; pt < 14; pt++) {
    row.push(nextRandom());
  }
  ZOBRIST_TABLE.push(row);
}

const SIDE_KEY = nextRandom();

export function computeZobristHash(board: Board, turn: PieceColor): number {
  let hash = turn === 'red' ? 0 : SIDE_KEY;

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const p = board[r][c];
      if (p) {
        const sq = r * BOARD_COLS + c;
        const key = `${p.color}-${p.type}`;
        const pIdx = PIECE_INDEX_MAP[key];
        if (pIdx !== undefined) {
          hash = (hash ^ ZOBRIST_TABLE[sq][pIdx]) >>> 0;
        }
      }
    }
  }

  return hash;
}
