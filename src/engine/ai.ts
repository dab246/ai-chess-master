import { Board, Move, PieceColor, Position, HintResult, AILevel } from '../types/chess';
import { getAllLegalMoves, makeMove, isInCheck } from './rules';
import { evaluateBoard, PIECE_BASE_VALUES } from './eval';
import { computeZobristHash } from './zobrist';

// Transposition Table Entry
type TTFlag = 'EXACT' | 'LOWERBOUND' | 'UPPERBOUND';

interface TTEntry {
  hash: number;
  depth: number;
  score: number;
  flag: TTFlag;
  bestMove?: Move;
}

// Fixed-size Transposition Table using Map
const TT_MAX_ENTRIES = 65536;
const transpositionTable = new Map<number, TTEntry>();

// Killer Moves table: [ply][0..1]
const MAX_PLY = 32;
const killerMoves: (Move | null)[][] = Array(MAX_PLY).fill(null).map(() => [null, null]);

// History Heuristic table: [10][9][10][9]
const historyTable: number[][][][] = Array(10).fill(0).map(() =>
  Array(9).fill(0).map(() =>
    Array(10).fill(0).map(() => Array(9).fill(0))
  )
);

// MVV-LVA (Most Valuable Victim - Least Valuable Attacker)
function getMvvLvaScore(move: Move): number {
  if (!move.captured) return 0;
  const victimVal = PIECE_BASE_VALUES[move.captured.type] || 0;
  const attackerVal = PIECE_BASE_VALUES[move.piece.type] || 0;
  return victimVal * 100 - attackerVal;
}

// Move comparator for optimal Alpha-Beta pruning cutoffs
function sortMovesWithHeuristics(
  moves: Move[],
  ttMove: Move | undefined,
  ply: number
): Move[] {
  const plySafe = Math.min(ply, MAX_PLY - 1);
  const killer1 = killerMoves[plySafe][0];
  const killer2 = killerMoves[plySafe][1];

  return moves.sort((a, b) => {
    // 1. TT Best move from previous search
    if (ttMove) {
      const aIsTT = a.from.r === ttMove.from.r && a.from.c === ttMove.from.c && a.to.r === ttMove.to.r && a.to.c === ttMove.to.c;
      const bIsTT = b.from.r === ttMove.from.r && b.from.c === ttMove.from.c && b.to.r === ttMove.to.r && b.to.c === ttMove.to.c;
      if (aIsTT) return -1;
      if (bIsTT) return 1;
    }

    // 2. Captures by MVV-LVA
    const aIsCapture = !!a.captured;
    const bIsCapture = !!b.captured;
    if (aIsCapture && !bIsCapture) return -1;
    if (!aIsCapture && bIsCapture) return 1;
    if (aIsCapture && bIsCapture) {
      return getMvvLvaScore(b) - getMvvLvaScore(a);
    }

    // 3. Killer Moves
    if (killer1) {
      const aIsK1 = a.from.r === killer1.from.r && a.from.c === killer1.from.c && a.to.r === killer1.to.r && a.to.c === killer1.to.c;
      const bIsK1 = b.from.r === killer1.from.r && b.from.c === killer1.from.c && b.to.r === killer1.to.r && b.to.c === killer1.to.c;
      if (aIsK1) return -1;
      if (bIsK1) return 1;
    }
    if (killer2) {
      const aIsK2 = a.from.r === killer2.from.r && a.from.c === killer2.from.c && a.to.r === killer2.to.r && a.to.c === killer2.to.c;
      const bIsK2 = b.from.r === killer2.from.r && b.from.c === killer2.from.c && b.to.r === killer2.to.r && b.to.c === killer2.to.c;
      if (aIsK2) return -1;
      if (bIsK2) return 1;
    }

    // 4. History Heuristic
    const aHist = historyTable[a.from.r][a.from.c][a.to.r][a.to.c];
    const bHist = historyTable[b.from.r][b.from.c][b.to.r][b.to.c];
    if (aHist !== bHist) {
      return bHist - aHist;
    }

    // 5. Checks
    if (a.isCheck && !b.isCheck) return -1;
    if (!a.isCheck && b.isCheck) return 1;

    return 0;
  });
}

/**
 * Quiescence Search with Delta Pruning
 * Resolves capture chains to prevent horizon effect
 */
function quiescence(
  board: Board,
  alpha: number,
  beta: number,
  color: PieceColor,
  maxQDepth: number,
  nodesRef: { count: number }
): number {
  nodesRef.count++;
  const standPat = color === 'red' ? evaluateBoard(board) : -evaluateBoard(board);

  if (maxQDepth <= 0) return standPat;
  if (standPat >= beta) return beta;

  // Delta Pruning: If even capturing a rook cannot raise alpha, skip
  const DELTA_MARGIN = 950;
  if (standPat < alpha - DELTA_MARGIN) {
    return alpha;
  }

  if (standPat > alpha) alpha = standPat;

  const legalMoves = getAllLegalMoves(color, board);
  const captureMoves = legalMoves.filter(m => !!m.captured);
  // Sort captures by MVV-LVA
  captureMoves.sort((a, b) => getMvvLvaScore(b) - getMvvLvaScore(a));

  for (const move of captureMoves) {
    const { nextBoard } = makeMove(board, move.from, move.to);
    const opponent: PieceColor = color === 'red' ? 'black' : 'red';
    const score = -quiescence(nextBoard, -beta, -alpha, opponent, maxQDepth - 1, nodesRef);

    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }

  return alpha;
}

/**
 * Negamax Alpha-Beta with Transposition Table, Killer Moves, and History Heuristic
 */
function alphaBeta(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  color: PieceColor,
  ply: number,
  useQuiescence: boolean,
  nodesRef: { count: number },
  deadline: number
): { score: number; bestMove?: Move } {
  nodesRef.count++;

  // Check time limit
  if (nodesRef.count % 1024 === 0 && performance.now() > deadline) {
    return { score: color === 'red' ? evaluateBoard(board) : -evaluateBoard(board) };
  }

  const hash = computeZobristHash(board, color);
  const ttEntry = transpositionTable.get(hash);

  if (ttEntry && ttEntry.depth >= depth && ply > 0) {
    if (ttEntry.flag === 'EXACT') {
      return { score: ttEntry.score, bestMove: ttEntry.bestMove };
    }
    if (ttEntry.flag === 'LOWERBOUND' && ttEntry.score >= beta) {
      return { score: ttEntry.score, bestMove: ttEntry.bestMove };
    }
    if (ttEntry.flag === 'UPPERBOUND' && ttEntry.score <= alpha) {
      return { score: ttEntry.score, bestMove: ttEntry.bestMove };
    }
  }

  const legalMoves = getAllLegalMoves(color, board);

  // Terminal state: Checkmate or Stalemate
  if (legalMoves.length === 0) {
    const isChecked = isInCheck(color, board);
    const terminalScore = isChecked ? -99999 + ply : -88888;
    return { score: terminalScore };
  }

  // Leaf node
  if (depth <= 0) {
    const score = useQuiescence
      ? quiescence(board, alpha, beta, color, 4, nodesRef)
      : (color === 'red' ? evaluateBoard(board) : -evaluateBoard(board));
    return { score };
  }

  // Move ordering with TT move, MVV-LVA, Killer Moves, and History Heuristic
  const sortedMoves = sortMovesWithHeuristics(legalMoves, ttEntry?.bestMove, ply);

  let bestMove = sortedMoves[0];
  let bestScore = -Infinity;
  const originalAlpha = alpha;

  for (const move of sortedMoves) {
    const { nextBoard } = makeMove(board, move.from, move.to);
    const opponent: PieceColor = color === 'red' ? 'black' : 'red';

    const result = alphaBeta(
      nextBoard,
      depth - 1,
      -beta,
      -alpha,
      opponent,
      ply + 1,
      useQuiescence,
      nodesRef,
      deadline
    );

    const score = -result.score;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }

    if (score > alpha) {
      alpha = score;
    }

    // Alpha-Beta Cutoff
    if (alpha >= beta) {
      // Record Killer Move (non-capture)
      if (!move.captured && ply < MAX_PLY) {
        if (killerMoves[ply][0]?.from.r !== move.from.r || killerMoves[ply][0]?.to.r !== move.to.r) {
          killerMoves[ply][1] = killerMoves[ply][0];
          killerMoves[ply][0] = move;
        }
      }
      // Record History Heuristic
      historyTable[move.from.r][move.from.c][move.to.r][move.to.c] += depth * depth;
      break;
    }
  }

  // Store into Transposition Table
  let flag: TTFlag = 'EXACT';
  if (bestScore <= originalAlpha) {
    flag = 'UPPERBOUND';
  } else if (bestScore >= beta) {
    flag = 'LOWERBOUND';
  }

  if (transpositionTable.size >= TT_MAX_ENTRIES) {
    transpositionTable.clear();
  }
  transpositionTable.set(hash, {
    hash,
    depth,
    score: bestScore,
    flag,
    bestMove,
  });

  return { score: bestScore, bestMove };
}

export interface SearchResult {
  bestMove: Move | null;
  score: number;
  depth: number;
  nodesSearched: number;
  timeMs: number;
}

/**
 * Iterative Deepening Alpha-Beta Search Engine
 * Progressively searches depth 1..targetDepth, ensuring best move is available even under strict time budget
 */
export async function findBestMove(
  board: Board,
  color: PieceColor,
  level: AILevel
): Promise<SearchResult> {
  const startTime = performance.now();
  const legalMoves = getAllLegalMoves(color, board);

  if (legalMoves.length === 0) {
    return { bestMove: null, score: 0, depth: 0, nodesSearched: 0, timeMs: 0 };
  }

  if (legalMoves.length === 1) {
    return { bestMove: legalMoves[0], score: 0, depth: 1, nodesSearched: 1, timeMs: 0 };
  }

  // Difficulty configurations: Depth, Time Budget, Blunder Rate
  let maxDepth = 4;
  let timeBudgetMs = 1200;
  let blunderChance = 0;
  let useQuiescence = true;

  switch (level) {
    case 'easy':
      maxDepth = 2;
      timeBudgetMs = 350;
      blunderChance = 0.25;
      useQuiescence = false;
      break;
    case 'medium':
      maxDepth = 3;
      timeBudgetMs = 600;
      blunderChance = 0.05;
      useQuiescence = true;
      break;
    case 'hard':
      maxDepth = 4;
      timeBudgetMs = 1200;
      blunderChance = 0;
      useQuiescence = true;
      break;
    case 'expert':
      maxDepth = 5;
      timeBudgetMs = 2000;
      blunderChance = 0;
      useQuiescence = true;
      break;
  }

  const deadline = startTime + timeBudgetMs;
  const nodesRef = { count: 0 };

  let overallBestMove = legalMoves[0];
  let overallBestScore = 0;
  let finalDepth = 1;

  // Iterative Deepening loop
  for (let d = 1; d <= maxDepth; d++) {
    // Yield to render event loop between iterations
    await new Promise(resolve => setTimeout(resolve, 10));

    if (performance.now() >= deadline && d > 2) {
      break;
    }

    const result = alphaBeta(
      board,
      d,
      -Infinity,
      Infinity,
      color,
      0,
      useQuiescence,
      nodesRef,
      deadline
    );

    if (result.bestMove) {
      overallBestMove = result.bestMove;
      overallBestScore = result.score;
      finalDepth = d;
    }

    // If checkmate found, terminate early
    if (Math.abs(overallBestScore) > 80000) {
      break;
    }
  }

  // Blunder simulation for beginner mode
  if (blunderChance > 0 && Math.random() < blunderChance && legalMoves.length > 2) {
    const alternativeMoves = legalMoves.filter(
      m => !(m.from.r === overallBestMove.from.r && m.from.c === overallBestMove.from.c && m.to.r === overallBestMove.to.r && m.to.c === overallBestMove.to.c)
    );
    if (alternativeMoves.length > 0) {
      overallBestMove = alternativeMoves[Math.floor(Math.random() * Math.min(3, alternativeMoves.length))];
    }
  }

  const elapsed = Math.round(performance.now() - startTime);

  return {
    bestMove: overallBestMove,
    score: overallBestScore,
    depth: finalDepth,
    nodesSearched: nodesRef.count,
    timeMs: elapsed,
  };
}

/**
 * Computes Hint with academic tactical explanation for user
 */
export async function computeHint(
  board: Board,
  color: PieceColor
): Promise<HintResult | null> {
  const result = await findBestMove(board, color, 'hard');
  if (!result.bestMove) return null;

  const move = result.bestMove;
  let reason = 'Tối ưu hóa vị trí chiến lược & kiểm soát không gian';

  if (move.isCheck) {
    reason = 'Chiếu tướng dồn ép, tước quyền tự do của đối phương';
  } else if (move.captured) {
    const pieceName = move.captured.type === 'r' ? 'Xe' :
                      move.captured.type === 'c' ? 'Pháo' :
                      move.captured.type === 'h' ? 'Mã' :
                      move.captured.type === 'p' ? 'Tốt' : 'quân';
    reason = `Bắt ${pieceName} gia tăng chênh lệch vật chất`;
  } else if (move.piece.type === 'r') {
    reason = 'Xe chiếm cứ tuyến lộ thông, khóa chặt quân đối phương';
  } else if (move.piece.type === 'c') {
    reason = 'Pháo uy hiếp trục lộ trung tâm hoặc hàng đáy';
  } else if (move.piece.type === 'h') {
    reason = 'Mã đột kích bàn hà, tạo thế liên hoàn công thủ';
  } else if (move.piece.type === 'p') {
    reason = 'Tốt qua sông kiểm soát điểm then chốt, thắt chặt thế cờ';
  }

  return {
    from: move.from,
    to: move.to,
    score: Math.round(result.score / 10) / 10,
    reason,
    depth: result.depth,
  };
}
