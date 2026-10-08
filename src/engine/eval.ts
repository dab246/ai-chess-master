import { Board, Piece, PieceColor, PieceType } from '../types/chess';
import { BOARD_COLS, BOARD_ROWS } from './rules';

export const PIECE_BASE_VALUES: Record<PieceType, number> = {
  k: 10000,
  r: 950,
  c: 500,
  h: 450,
  e: 220,
  a: 220,
  p: 120,
};

// Piece-Square Tables from Red perspective (row 0 = Black baseline, row 9 = Red baseline)
// For Black, row is mirrored: `mirrorRow = 9 - r`

// Soldier (Binh/Tốt) PST
const PAWN_PST_RED: number[][] = [
  [  0,   3,   6,   9,   9,   9,   6,   3,   0], // 0 (Black baseline - deep enemy territory)
  [ 40,  60,  80, 100, 110, 100,  80,  60,  40], // 1 (Attacking palace)
  [ 30,  50,  70,  90,  95,  90,  70,  50,  30], // 2 (Palace outskirts)
  [ 25,  40,  55,  75,  80,  75,  55,  40,  25], // 3 (High enemy territory)
  [ 20,  30,  45,  60,  65,  60,  45,  30,  20], // 4 (Just crossed river)
  // River line
  [  0,   0,   0,   0,   0,   0,   0,   0,   0], // 5 (Our side of river)
  [ -5,   0,   5,   0,  10,   0,   5,   0,  -5], // 6 (Pawn start rank)
  [  0,   0,   0,   0,   0,   0,   0,   0,   0], // 7
  [  0,   0,   0,   0,   0,   0,   0,   0,   0], // 8
  [  0,   0,   0,   0,   0,   0,   0,   0,   0], // 9
];

// Horse (Mã) PST
const HORSE_PST_RED: number[][] = [
  [ 10,  20,  30,  35,  25,  35,  30,  20,  10], // 0
  [ 20,  35,  45,  55,  50,  55,  45,  35,  20], // 1
  [ 25,  45,  60,  70,  65,  70,  60,  45,  25], // 2 (Ngọa tào / dangerous outposts)
  [ 20,  40,  55,  65,  60,  65,  55,  40,  20], // 3
  [ 15,  30,  40,  50,  45,  50,  40,  30,  15], // 4 (River frontier)
  [ 10,  20,  30,  35,  35,  35,  30,  20,  10], // 5
  [  5,  15,  25,  30,  25,  30,  25,  15,   5], // 6
  [  0,  10,  15,  20,  15,  20,  15,  10,   0], // 7
  [ -5,   5,  10,  15,  10,  15,  10,   5,  -5], // 8
  [-10,  -5,   0,   5,   0,   5,   0,  -5, -10], // 9 (Starting rank)
];

// Cannon (Pháo) PST
const CANNON_PST_RED: number[][] = [
  [ 15,  20,  20,  25,  30,  25,  20,  20,  15], // 0 (Pháo đáy)
  [ 15,  25,  25,  35,  40,  35,  25,  25,  15], // 1
  [ 10,  20,  25,  30,  35,  30,  25,  20,  10], // 2
  [  5,  15,  20,  30,  45,  30,  20,  15,   5], // 3
  [  5,  15,  20,  25,  40,  25,  20,  15,   5], // 4
  [  0,  10,  15,  20,  35,  20,  15,  10,   0], // 5
  [  0,   5,  10,  15,  30,  15,  10,   5,   0], // 6
  [ -5,   0,   5,  10,  25,  10,   5,   0,  -5], // 7 (Start rank)
  [-10,  -5,   0,   5,  15,   5,   0,  -5, -10], // 8
  [-15, -10,  -5,   0,   0,   0,  -5, -10, -15], // 9
];

// Chariot (Xe) PST
const ROOK_PST_RED: number[][] = [
  [ 25,  35,  40,  45,  45,  45,  40,  35,  25], // 0
  [ 30,  40,  50,  55,  55,  55,  50,  40,  30], // 1
  [ 25,  35,  45,  50,  50,  50,  45,  35,  25], // 2
  [ 20,  30,  40,  45,  45,  45,  40,  30,  20], // 3
  [ 15,  25,  35,  40,  40,  40,  35,  25,  15], // 4
  [ 10,  20,  30,  35,  35,  35,  30,  20,  10], // 5
  [  5,  15,  25,  30,  30,  30,  25,  15,   5], // 6
  [  0,  10,  20,  25,  25,  25,  20,  10,   0], // 7
  [ -5,   5,  15,  20,  20,  20,  15,   5,  -5], // 8
  [-10,   0,  10,  15,  15,  15,  10,   0, -10], // 9
];

// Elephant (Tượng) PST
const ELEPHANT_PST_RED: number[][] = [
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,  15,   0,   0,   0,  15,   0,   0], // 5
  [  0,   0,   0,   0,   0,   0,   0,   0,   0], // 6
  [ 10,   0,   0,   0,  25,   0,   0,   0,  10], // 7 (Center elephant bonus)
  [  0,   0,   0,   0,   0,   0,   0,   0,   0], // 8
  [  0,   0,   5,   0,   0,   0,   5,   0,   0], // 9
];

// Advisor (Sĩ) PST
const ADVISOR_PST_RED: number[][] = [
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,  15,   0,  15,   0,   0,   0], // 7
  [  0,   0,   0,   0,  25,   0,   0,   0,   0], // 8 (Center advisor)
  [  0,   0,   0,  10,   0,  10,   0,   0,   0], // 9
];

// King (Tướng) PST
const KING_PST_RED: number[][] = [
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0,   0,   0,   0,   0,   0,   0],
  [  0,   0,   0, -10, -20, -10,   0,   0,   0], // 7 (Upper palace: danger)
  [  0,   0,   0,   0, -10,   0,   0,   0,   0], // 8
  [  0,   0,   0,  10,  15,  10,   0,   0,   0], // 9 (Safe bottom palace)
];

function getPiecePSTValue(piece: Piece, r: number, c: number): number {
  const isRed = piece.color === 'red';
  const tableRow = isRed ? r : 9 - r;
  const tableCol = c;

  switch (piece.type) {
    case 'p': return PAWN_PST_RED[tableRow][tableCol];
    case 'h': return HORSE_PST_RED[tableRow][tableCol];
    case 'c': return CANNON_PST_RED[tableRow][tableCol];
    case 'r': return ROOK_PST_RED[tableRow][tableCol];
    case 'e': return ELEPHANT_PST_RED[tableRow][tableCol];
    case 'a': return ADVISOR_PST_RED[tableRow][tableCol];
    case 'k': return KING_PST_RED[tableRow][tableCol];
    default: return 0;
  }
}

/**
 * Returns static positional evaluation from the perspective of Red.
 * Positive score = Red is winning; Negative score = Black is winning.
 */
export function evaluateBoard(board: Board): number {
  let redScore = 0;
  let blackScore = 0;

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece) {
        const baseVal = PIECE_BASE_VALUES[piece.type];
        const pstVal = getPiecePSTValue(piece, r, c);
        const totalPieceVal = baseVal + pstVal;

        if (piece.color === 'red') {
          redScore += totalPieceVal;
        } else {
          blackScore += totalPieceVal;
        }
      }
    }
  }

  return redScore - blackScore;
}
