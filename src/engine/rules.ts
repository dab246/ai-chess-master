import { Board, Piece, PieceColor, PieceType, Position, Move } from '../types/chess';

export const BOARD_ROWS = 10;
export const BOARD_COLS = 9;

// Vietnamese piece names and symbols
export const PIECE_NAMES: Record<PieceType, { red: string; black: string; vi: string }> = {
  k: { red: '帥', black: '將', vi: 'Tướng' },
  a: { red: '仕', black: '士', vi: 'Sĩ' },
  e: { red: '相', black: '象', vi: 'Tượng' },
  h: { red: '傌', black: '馬', vi: 'Mã' },
  r: { red: '俥', black: '車', vi: 'Xe' },
  c: { red: '炮', black: '砲', vi: 'Pháo' },
  p: { red: '兵', black: '卒', vi: 'Tốt' },
};

export function createInitialBoard(): Board {
  const board: Board = Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));

  let idCounter = 0;
  const p = (type: PieceType, color: PieceColor): Piece => ({
    type,
    color,
    id: `${color}-${type}-${idCounter++}`,
  });

  // Black (top)
  board[0][0] = p('r', 'black');
  board[0][1] = p('h', 'black');
  board[0][2] = p('e', 'black');
  board[0][3] = p('a', 'black');
  board[0][4] = p('k', 'black');
  board[0][5] = p('a', 'black');
  board[0][6] = p('e', 'black');
  board[0][7] = p('h', 'black');
  board[0][8] = p('r', 'black');

  board[2][1] = p('c', 'black');
  board[2][7] = p('c', 'black');

  board[3][0] = p('p', 'black');
  board[3][2] = p('p', 'black');
  board[3][4] = p('p', 'black');
  board[3][6] = p('p', 'black');
  board[3][8] = p('p', 'black');

  // Red (bottom)
  board[6][0] = p('p', 'red');
  board[6][2] = p('p', 'red');
  board[6][4] = p('p', 'red');
  board[6][6] = p('p', 'red');
  board[6][8] = p('p', 'red');

  board[7][1] = p('c', 'red');
  board[7][7] = p('c', 'red');

  board[9][0] = p('r', 'red');
  board[9][1] = p('h', 'red');
  board[9][2] = p('e', 'red');
  board[9][3] = p('a', 'red');
  board[9][4] = p('k', 'red');
  board[9][5] = p('a', 'red');
  board[9][6] = p('e', 'red');
  board[9][7] = p('h', 'red');
  board[9][8] = p('r', 'red');

  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

export function isInsideBoard(r: number, c: number): boolean {
  return r >= 0 && r < BOARD_ROWS && c >= 0 && c < BOARD_COLS;
}

export function isInPalace(r: number, c: number, color: PieceColor): boolean {
  if (c < 3 || c > 5) return false;
  if (color === 'red') return r >= 7 && r <= 9;
  return r >= 0 && r <= 2;
}

export function findKing(color: PieceColor, board: Board): Position | null {
  const minR = color === 'red' ? 7 : 0;
  const maxR = color === 'red' ? 9 : 2;
  for (let r = minR; r <= maxR; r++) {
    for (let c = 3; c <= 5; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === color) {
        return { r, c };
      }
    }
  }
  // Fallback scan whole board if misplaced
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === color) {
        return { r, c };
      }
    }
  }
  return null;
}

// Flying General (Đối mặt tướng) rule check
export function areKingsFacing(board: Board): boolean {
  const redKing = findKing('red', board);
  const blackKing = findKing('black', board);
  if (!redKing || !blackKing) return false;

  if (redKing.c !== blackKing.c) return false;

  const col = redKing.c;
  const startR = Math.min(redKing.r, blackKing.r) + 1;
  const endR = Math.max(redKing.r, blackKing.r);

  for (let r = startR; r < endR; r++) {
    if (board[r][col] !== null) return false;
  }
  return true;
}

// Fast check if color is in check
export function isInCheck(color: PieceColor, board: Board): boolean {
  const kingPos = findKing(color, board);
  if (!kingPos) return true; // No king = considered in check / lost

  const enemyColor: PieceColor = color === 'red' ? 'black' : 'red';

  // 1. Check Flying General
  const enemyKing = findKing(enemyColor, board);
  if (enemyKing && enemyKing.c === kingPos.c) {
    let blocked = false;
    const startR = Math.min(kingPos.r, enemyKing.r) + 1;
    const endR = Math.max(kingPos.r, enemyKing.r);
    for (let r = startR; r < endR; r++) {
      if (board[r][kingPos.c] !== null) {
        blocked = true;
        break;
      }
    }
    if (!blocked) return true;
  }

  // 2. Check Orthogonal rays for Rook and Cannon
  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  for (const { dr, dc } of directions) {
    let r = kingPos.r + dr;
    let c = kingPos.c + dc;
    let hurdleCount = 0;

    while (isInsideBoard(r, c)) {
      const p = board[r][c];
      if (p !== null) {
        if (hurdleCount === 0) {
          // First piece met
          if (p.color === enemyColor && p.type === 'r') {
            return true;
          }
          hurdleCount = 1;
        } else if (hurdleCount === 1) {
          // Second piece met
          if (p.color === enemyColor && p.type === 'c') {
            return true;
          }
          break; // Cannon can only jump one screen
        }
      }
      r += dr;
      c += dc;
    }
  }

  // 3. Check Knight (Horse) attacks
  // Enemy horse at (hr, hc) attacking King at (kingPos.r, kingPos.c)
  const horseJumps = [
    { dr: -2, dc: -1 }, { dr: -2, dc: 1 },
    { dr: 2, dc: -1 }, { dr: 2, dc: 1 },
    { dr: -1, dc: -2 }, { dr: 1, dc: -2 },
    { dr: -1, dc: 2 }, { dr: 1, dc: 2 },
  ];

  for (const j of horseJumps) {
    const hr = kingPos.r + j.dr;
    const hc = kingPos.c + j.dc;
    if (isInsideBoard(hr, hc)) {
      const p = board[hr][hc];
      if (p && p.color === enemyColor && p.type === 'h') {
        // Find hobble/leg square for horse moving towards king
        let legR = hr;
        let legC = hc;
        if (Math.abs(j.dr) === 2) {
          // Vertical step of 2: leg is 1 step from horse in vertical direction towards King
          legR = hr + (kingPos.r > hr ? 1 : -1);
          legC = hc;
        } else {
          // Horizontal step of 2: leg is 1 step from horse in horizontal direction towards King
          legR = hr;
          legC = hc + (kingPos.c > hc ? 1 : -1);
        }
        if (board[legR][legC] === null) {
          return true;
        }
      }
    }
  }

  // 4. Check Soldier / Pawn attacks
  if (color === 'red') {
    // Enemy is black, black soldiers move downward (+r)
    // Black pawn can attack red king if at (kingPos.r - 1, kingPos.c) or sideways
    const forwardPawn = board[kingPos.r - 1]?.[kingPos.c];
    if (forwardPawn && forwardPawn.color === 'black' && forwardPawn.type === 'p') return true;

    // Sideways attacks
    if (kingPos.c > 0) {
      const leftPawn = board[kingPos.r][kingPos.c - 1];
      if (leftPawn && leftPawn.color === 'black' && leftPawn.type === 'p') return true;
    }
    if (kingPos.c < BOARD_COLS - 1) {
      const rightPawn = board[kingPos.r][kingPos.c + 1];
      if (rightPawn && rightPawn.color === 'black' && rightPawn.type === 'p') return true;
    }
  } else {
    // Enemy is red, red soldiers move upward (-r)
    const forwardPawn = board[kingPos.r + 1]?.[kingPos.c];
    if (forwardPawn && forwardPawn.color === 'red' && forwardPawn.type === 'p') return true;

    if (kingPos.c > 0) {
      const leftPawn = board[kingPos.r][kingPos.c - 1];
      if (leftPawn && leftPawn.color === 'red' && leftPawn.type === 'p') return true;
    }
    if (kingPos.c < BOARD_COLS - 1) {
      const rightPawn = board[kingPos.r][kingPos.c + 1];
      if (rightPawn && rightPawn.color === 'red' && rightPawn.type === 'p') return true;
    }
  }

  return false;
}

// Generate pseudo-legal destination squares for a piece at (r, c)
export function getPseudoLegalMoves(r: number, c: number, board: Board): Position[] {
  const piece = board[r][c];
  if (!piece) return [];

  const moves: Position[] = [];
  const color = piece.color;

  switch (piece.type) {
    case 'k': {
      const deltas = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
      ];
      for (const [dr, dc] of deltas) {
        const nr = r + dr;
        const nc = c + dc;
        if (isInPalace(nr, nc, color)) {
          const dest = board[nr][nc];
          if (!dest || dest.color !== color) {
            moves.push({ r: nr, c: nc });
          }
        }
      }
      break;
    }

    case 'a': {
      const deltas = [
        [-1, -1], [-1, 1], [1, -1], [1, 1]
      ];
      for (const [dr, dc] of deltas) {
        const nr = r + dr;
        const nc = c + dc;
        if (isInPalace(nr, nc, color)) {
          const dest = board[nr][nc];
          if (!dest || dest.color !== color) {
            moves.push({ r: nr, c: nc });
          }
        }
      }
      break;
    }

    case 'e': {
      const deltas = [
        [-2, -2], [-2, 2], [2, -2], [2, 2]
      ];
      for (const [dr, dc] of deltas) {
        const nr = r + dr;
        const nc = c + dc;
        // Cannot cross river
        const validSide = color === 'red' ? (nr >= 5 && nr <= 9) : (nr >= 0 && nr <= 4);
        if (validSide && isInsideBoard(nr, nc)) {
          // Check elephant eye
          const eyeR = r + dr / 2;
          const eyeC = c + dc / 2;
          if (board[eyeR][eyeC] === null) {
            const dest = board[nr][nc];
            if (!dest || dest.color !== color) {
              moves.push({ r: nr, c: nc });
            }
          }
        }
      }
      break;
    }

    case 'h': {
      const jumps = [
        { dr: -2, dc: -1, legR: -1, legC: 0 },
        { dr: -2, dc: 1, legR: -1, legC: 0 },
        { dr: 2, dc: -1, legR: 1, legC: 0 },
        { dr: 2, dc: 1, legR: 1, legC: 0 },
        { dr: -1, dc: -2, legR: 0, legC: -1 },
        { dr: 1, dc: -2, legR: 0, legC: -1 },
        { dr: -1, dc: 2, legR: 0, legC: 1 },
        { dr: 1, dc: 2, legR: 0, legC: 1 },
      ];
      for (const j of jumps) {
        const nr = r + j.dr;
        const nc = c + j.dc;
        if (isInsideBoard(nr, nc)) {
          // Check blocked horse leg
          const legR = r + j.legR;
          const legC = c + j.legC;
          if (board[legR][legC] === null) {
            const dest = board[nr][nc];
            if (!dest || dest.color !== color) {
              moves.push({ r: nr, c: nc });
            }
          }
        }
      }
      break;
    }

    case 'r': {
      const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
      ];
      for (const [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;
        while (isInsideBoard(nr, nc)) {
          const dest = board[nr][nc];
          if (!dest) {
            moves.push({ r: nr, c: nc });
          } else {
            if (dest.color !== color) {
              moves.push({ r: nr, c: nc });
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      break;
    }

    case 'c': {
      const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
      ];
      for (const [dr, dc] of directions) {
        let nr = r + dr;
        let nc = c + dc;
        let jumped = false;
        while (isInsideBoard(nr, nc)) {
          const dest = board[nr][nc];
          if (!jumped) {
            if (!dest) {
              moves.push({ r: nr, c: nc });
            } else {
              jumped = true; // Found the screen/ngòi
            }
          } else {
            if (dest) {
              if (dest.color !== color) {
                moves.push({ r: nr, c: nc });
              }
              break; // Cannon can only capture the first piece after the screen
            }
          }
          nr += dr;
          nc += dc;
        }
      }
      break;
    }

    case 'p': {
      const isCrossed = color === 'red' ? r <= 4 : r >= 5;
      const forwardDr = color === 'red' ? -1 : 1;

      // 1. Move forward
      const fnr = r + forwardDr;
      if (isInsideBoard(fnr, c)) {
        const dest = board[fnr][c];
        if (!dest || dest.color !== color) {
          moves.push({ r: fnr, c });
        }
      }

      // 2. Move sideways if crossed river
      if (isCrossed) {
        const leftC = c - 1;
        if (isInsideBoard(r, leftC)) {
          const dest = board[r][leftC];
          if (!dest || dest.color !== color) {
            moves.push({ r, c: leftC });
          }
        }
        const rightC = c + 1;
        if (isInsideBoard(r, rightC)) {
          const dest = board[r][rightC];
          if (!dest || dest.color !== color) {
            moves.push({ r, c: rightC });
          }
        }
      }
      break;
    }
  }

  return moves;
}

// Generate fully legal moves for piece at (r, c)
export function getLegalMovesForPosition(r: number, c: number, board: Board): Position[] {
  const piece = board[r][c];
  if (!piece) return [];

  const pseudoMoves = getPseudoLegalMoves(r, c, board);
  const legal: Position[] = [];

  for (const to of pseudoMoves) {
    // Clone and make move
    const newBoard = cloneBoard(board);
    newBoard[to.r][to.c] = piece;
    newBoard[r][c] = null;

    // Check if own king in check or kings facing
    if (!isInCheck(piece.color, newBoard) && !areKingsFacing(newBoard)) {
      legal.push(to);
    }
  }

  return legal;
}

// Get all legal moves for a color
export function getAllLegalMoves(color: PieceColor, board: Board): Move[] {
  const allMoves: Move[] = [];

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const destinations = getLegalMovesForPosition(r, c, board);
        for (const to of destinations) {
          const captured = board[to.r][to.c];
          const notation = generateVietnameseNotation({ r, c }, to, piece, board);
          allMoves.push({
            from: { r, c },
            to,
            piece,
            captured,
            notation,
            color,
          });
        }
      }
    }
  }

  return allMoves;
}

// Vietnamese standard notation generator
export function generateVietnameseNotation(
  from: Position,
  to: Position,
  piece: Piece,
  board: Board
): string {
  const isRed = piece.color === 'red';
  const pieceSymbol = PIECE_NAMES[piece.type].vi;

  // Xiangqi traditional column numbers:
  // For Red: columns 0..8 mapped to 9..1 (right to left from Red's perspective)
  // For Black: columns 0..8 mapped to 1..9 (right to left from Black's perspective)
  const fromColNum = isRed ? 9 - from.c : from.c + 1;
  const toColNum = isRed ? 9 - to.c : to.c + 1;

  // Check if multiple pieces of the same type exist on the same column
  const sameColPieces: { r: number; c: number }[] = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    const p = board[r][from.c];
    if (p && p.color === piece.color && p.type === piece.type) {
      sameColPieces.push({ r, c: from.c });
    }
  }

  let prefix = pieceSymbol;
  let useColPrefix = true;

  if (sameColPieces.length === 2) {
    sameColPieces.sort((a, b) => a.r - b.r);
    // Red moves from bottom up, so lower row (smaller r) is closer to opponent (Tiền)
    const isFront = isRed ? from.r === sameColPieces[0].r : from.r === sameColPieces[1].r;
    prefix = (isFront ? 'Tiền ' : 'Hậu ') + pieceSymbol;
    useColPrefix = false;
  }

  const piecePrefix = useColPrefix ? `${prefix} ${fromColNum}` : prefix;

  // Determine movement direction
  const dr = to.r - from.r;
  const isDiagonal = piece.type === 'h' || piece.type === 'e' || piece.type === 'a';

  if (dr === 0) {
    // Horizontal (Bình)
    return `${piecePrefix} bình ${toColNum}`;
  }

  const isAdvancing = isRed ? dr < 0 : dr > 0;
  const actionWord = isAdvancing ? 'tiến' : 'thoái';

  if (isDiagonal) {
    // Diagonal pieces always specify the destination column number
    return `${piecePrefix} ${actionWord} ${toColNum}`;
  } else {
    // Linear pieces (Xe, Pháo, Binh, Tướng) specify steps
    const steps = Math.abs(dr);
    return `${piecePrefix} ${actionWord} ${steps}`;
  }
}

// Make a move on board returning new board & move object
export function makeMove(
  board: Board,
  from: Position,
  to: Position
): { nextBoard: Board; move: Move } {
  const piece = board[from.r][from.c]!;
  const captured = board[to.r][to.c];
  const nextBoard = cloneBoard(board);

  nextBoard[to.r][to.c] = piece;
  nextBoard[from.r][from.c] = null;

  const opponentColor: PieceColor = piece.color === 'red' ? 'black' : 'red';
  const givesCheck = isInCheck(opponentColor, nextBoard);

  const notation = generateVietnameseNotation(from, to, piece, board);

  const move: Move = {
    from,
    to,
    piece,
    captured,
    notation: givesCheck ? `${notation} (+)` : notation,
    color: piece.color,
    isCheck: givesCheck,
  };

  return { nextBoard, move };
}
