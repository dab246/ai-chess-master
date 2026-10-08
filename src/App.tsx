import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Board as BoardType,
  Position,
  Move,
  PieceColor,
  GameMode,
  AILevel,
  GameResult,
  HintResult,
  Piece,
} from './types/chess';
import {
  createInitialBoard,
  getLegalMovesForPosition,
  makeMove,
  findKing,
  isInCheck,
  getAllLegalMoves,
} from './engine/rules';
import { evaluateBoard } from './engine/eval';
import { findBestMove, computeHint, SearchResult } from './engine/ai';
import { sound } from './services/sound';
import {
  saveGameState,
  loadGameState,
  clearSavedGameState,
  getPlayerStats,
  recordGameResult,
} from './services/storage';

import { Board } from './components/Board';
import { GameControls } from './components/GameControls';
import { HistoryPanel } from './components/HistoryPanel';
import { PlayerCard } from './components/PlayerCard';
import { EvaluationBar } from './components/EvaluationBar';
import { HintBanner } from './components/HintBanner';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AiPresentationModal } from './components/AiPresentationModal';
import { BookOpen } from 'lucide-react';

export default function App() {
  // Game Core States
  const [board, setBoard] = useState<BoardType>(() => createInitialBoard());
  const [turn, setTurn] = useState<PieceColor>('red');
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Board snapshots corresponding to move history for instant rewinding
  const [boardSnapshots, setBoardSnapshots] = useState<BoardType[]>([createInitialBoard()]);

  // Captures
  const [capturedRed, setCapturedRed] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);

  // Modes & Settings
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [aiLevel, setAiLevel] = useState<AILevel>('hard');
  const [playerColor] = useState<PieceColor>('red');
  const [flipped, setFlipped] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(sound.enabled);

  // Status & Evaluation
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [hint, setHint] = useState<HintResult | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isHintLoading, setIsHintLoading] = useState<boolean>(false);
  const [evalScore, setEvalScore] = useState<number>(0);
  const [aiTelemetry, setAiTelemetry] = useState<SearchResult | null>(null);

  // Timers (seconds)
  const [timerRed, setTimerRed] = useState<number>(0);
  const [timerBlack, setTimerBlack] = useState<number>(0);

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [playerStats, setPlayerStats] = useState(() => getPlayerStats());
  const [eloResult, setEloResult] = useState<{ delta: number; newElo: number } | null>(null);

  // Mutable refs to prevent stale closures and effect dependency thrashing
  const boardRef = useRef(board);
  boardRef.current = board;
  const turnRef = useRef(turn);
  turnRef.current = turn;
  const gameResultRef = useRef(gameResult);
  gameResultRef.current = gameResult;
  const moveHistoryRef = useRef(moveHistory);
  moveHistoryRef.current = moveHistory;
  const boardSnapshotsRef = useRef(boardSnapshots);
  boardSnapshotsRef.current = boardSnapshots;
  const aiLevelRef = useRef(aiLevel);
  aiLevelRef.current = aiLevel;
  const gameModeRef = useRef(gameMode);
  gameModeRef.current = gameMode;

  // Restore game state on mount if saved
  useEffect(() => {
    const saved = loadGameState();
    if (saved && saved.moveHistory.length > 0) {
      setBoard(saved.board);
      setTurn(saved.turn);
      setMoveHistory(saved.moveHistory);
      setHistoryIndex(saved.moveHistory.length - 1);
      setCapturedRed(saved.capturedRed || []);
      setCapturedBlack(saved.capturedBlack || []);
      setGameMode(saved.gameMode || 'ai');
      setAiLevel(saved.aiLevel || 'hard');
      setGameResult(saved.gameResult || null);
      setTimerRed(saved.timerRed || 0);
      setTimerBlack(saved.timerBlack || 0);
      setEvalScore(evaluateBoard(saved.board));

      // Reconstruct snapshots
      let curr = createInitialBoard();
      const snaps: BoardType[] = [curr];
      for (const m of saved.moveHistory) {
        const { nextBoard } = makeMove(curr, m.from, m.to);
        curr = nextBoard;
        snaps.push(curr);
      }
      setBoardSnapshots(snaps);
    }
  }, []);

  // Save game state automatically
  useEffect(() => {
    if (moveHistory.length > 0 && !gameResult) {
      saveGameState({
        board,
        turn,
        moveHistory,
        capturedRed,
        capturedBlack,
        gameMode,
        aiLevel,
        playerColor,
        gameResult,
        timerRed,
        timerBlack,
        timestamp: Date.now(),
      });
    }
  }, [board, turn, moveHistory, capturedRed, capturedBlack, gameMode, aiLevel, playerColor, gameResult, timerRed, timerBlack]);

  // Turn timer interval
  useEffect(() => {
    if (gameResult) return;
    const interval = setInterval(() => {
      if (turn === 'red') {
        setTimerRed(prev => prev + 1);
      } else {
        setTimerBlack(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [turn, gameResult]);

  // In-check detection
  const isRedInCheck = isInCheck('red', board);
  const isBlackInCheck = isInCheck('black', board);
  const isCurrentInCheck = turn === 'red' ? isRedInCheck : isBlackInCheck;
  const checkedKingPos = isCurrentInCheck ? findKing(turn, board) : null;

  // Play alert sound on check
  useEffect(() => {
    if (isCurrentInCheck && !gameResult) {
      sound.playCheck();
    }
  }, [isCurrentInCheck, gameResult]);

  // Check Game Over condition
  const checkGameOver = useCallback((currentBoard: BoardType, nextTurn: PieceColor) => {
    const legalMoves = getAllLegalMoves(nextTurn, currentBoard);
    if (legalMoves.length === 0) {
      const winnerColor: PieceColor = nextTurn === 'red' ? 'black' : 'red';
      const result: GameResult = winnerColor === 'red' ? 'red_win' : 'black_win';
      setGameResult(result);
      clearSavedGameState();

      if (winnerColor === 'red') {
        sound.playVictory();
      } else {
        sound.playDefeat();
      }

      const { eloDelta, newStats } = recordGameResult(result, aiLevelRef.current, gameModeRef.current === 'ai');
      setPlayerStats(newStats);
      setEloResult({ delta: eloDelta, newElo: newStats.elo });
      return true;
    }
    return false;
  }, []);

  // Execute Move on Board
  const executeMove = useCallback((from: Position, to: Position) => {
    const currentBoard = boardRef.current;
    const currentPiece = currentBoard[from.r][from.c];
    if (!currentPiece) return;

    // Reset selection and hint
    setHint(null);
    setSelectedPos(null);
    setValidMoves([]);

    const { nextBoard, move } = makeMove(currentBoard, from, to);

    // Audio effects
    if (move.captured) {
      sound.playCapture();
      if (move.captured.color === 'red') {
        setCapturedRed(prev => [...prev, move.captured!]);
      } else {
        setCapturedBlack(prev => [...prev, move.captured!]);
      }
    } else {
      sound.playMove();
    }

    const nextTurn: PieceColor = currentPiece.color === 'red' ? 'black' : 'red';
    const nextHistory = [...moveHistoryRef.current, move];
    const nextSnapshots = [...boardSnapshotsRef.current, nextBoard];

    setBoard(nextBoard);
    setBoardSnapshots(nextSnapshots);
    setMoveHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setTurn(nextTurn);

    // Update real-time Eval score
    const newEval = evaluateBoard(nextBoard);
    setEvalScore(newEval);

    // Check game over
    checkGameOver(nextBoard, nextTurn);
  }, [checkGameOver]);

  const executeMoveRef = useRef(executeMove);
  executeMoveRef.current = executeMove;

  // AI Move Engine Trigger with guaranteed non-blocking execution & cleanup
  useEffect(() => {
    if (gameMode !== 'ai' || turn !== 'black' || gameResult) {
      return;
    }

    let isCancelled = false;
    setIsAiThinking(true);

    const triggerAi = async () => {
      try {
        // Brief delay to ensure DOM render update
        await new Promise(resolve => setTimeout(resolve, 80));
        if (isCancelled) return;

        const result = await findBestMove(boardRef.current, 'black', aiLevelRef.current);
        if (isCancelled) return;

        setAiTelemetry(result);

        if (result.bestMove) {
          executeMoveRef.current(result.bestMove.from, result.bestMove.to);
        } else {
          checkGameOver(boardRef.current, 'black');
        }
      } catch (err) {
        console.error('AI calculation exception:', err);
      } finally {
        setIsAiThinking(false);
      }
    };

    triggerAi();

    return () => {
      isCancelled = true;
      setIsAiThinking(false);
    };
  }, [turn, gameMode, gameResult, checkGameOver]);

  // Click Square Handler
  const handleSquareClick = (r: number, c: number) => {
    // If viewing history, snap back to present board
    if (historyIndex < moveHistory.length - 1) {
      setHistoryIndex(moveHistory.length - 1);
      setBoard(boardSnapshots[boardSnapshots.length - 1]);
    }

    if (gameResult) {
      return;
    }

    // In AI mode, block clicks when it is Black's turn (AI is calculating)
    if (gameMode === 'ai' && turn === 'black') {
      return;
    }

    const currentBoard = boardRef.current;
    const piece = currentBoard[r][c];

    // If a piece is already selected
    if (selectedPos) {
      // Check if clicking a valid destination
      const isDestination = validMoves.some(m => m.r === r && m.c === c);
      if (isDestination) {
        executeMove(selectedPos, { r, c });
        return;
      }

      // If clicking the same piece, deselect
      if (selectedPos.r === r && selectedPos.c === c) {
        setSelectedPos(null);
        setValidMoves([]);
        return;
      }

      // If clicking another piece of the friendly color, select that instead
      if (piece && piece.color === turn) {
        setSelectedPos({ r, c });
        setValidMoves(getLegalMovesForPosition(r, c, currentBoard));
        return;
      }

      // Clicked elsewhere, cancel selection
      setSelectedPos(null);
      setValidMoves([]);
      return;
    }

    // Select piece
    if (piece && piece.color === turn) {
      setSelectedPos({ r, c });
      setValidMoves(getLegalMovesForPosition(r, c, currentBoard));
    }
  };

  // Compute Tactical Hint
  const handleRequestHint = async () => {
    if (gameResult || isAiThinking || isHintLoading) return;
    setIsHintLoading(true);
    try {
      const hintResult = await computeHint(board, turn);
      if (hintResult) {
        setHint(hintResult);
        setSelectedPos(hintResult.from);
        setValidMoves(getLegalMovesForPosition(hintResult.from.r, hintResult.from.c, board));
      }
    } catch (e) {
      console.error('Hint calculation failed:', e);
    } finally {
      setIsHintLoading(false);
    }
  };

  // Apply Hint Move
  const handleApplyHint = () => {
    if (hint) {
      executeMove(hint.from, hint.to);
    }
  };

  // Undo Move
  const handleUndo = () => {
    if (isAiThinking || moveHistory.length === 0) return;

    const stepCount = gameMode === 'ai' && moveHistory.length >= 2 ? 2 : 1;
    const targetIdx = moveHistory.length - stepCount;

    if (targetIdx < 0) {
      handleNewGame();
      return;
    }

    const nextHistory = moveHistory.slice(0, targetIdx);
    const nextSnapshots = boardSnapshots.slice(0, targetIdx + 1);
    const restoredBoard = nextSnapshots[nextSnapshots.length - 1];

    setBoard(restoredBoard);
    setBoardSnapshots(nextSnapshots);
    setMoveHistory(nextHistory);
    setHistoryIndex(targetIdx - 1);
    setTurn(targetIdx % 2 === 0 ? 'red' : 'black');
    setSelectedPos(null);
    setValidMoves([]);
    setHint(null);
    setGameResult(null);
    setEvalScore(evaluateBoard(restoredBoard));
  };

  // Redo Move
  const handleRedo = () => {
    if (isAiThinking || historyIndex >= moveHistory.length - 1) return;
    const nextIdx = historyIndex + 1;
    setHistoryIndex(nextIdx);
    setBoard(boardSnapshots[nextIdx + 1]);
    setTurn((nextIdx + 1) % 2 === 0 ? 'red' : 'black');
  };

  // New Game
  const handleNewGame = () => {
    clearSavedGameState();
    const initBoard = createInitialBoard();
    setBoard(initBoard);
    setBoardSnapshots([initBoard]);
    setTurn('red');
    setSelectedPos(null);
    setValidMoves([]);
    setMoveHistory([]);
    setHistoryIndex(-1);
    setCapturedRed([]);
    setCapturedBlack([]);
    setGameResult(null);
    setHint(null);
    setTimerRed(0);
    setTimerBlack(0);
    setEvalScore(0);
    setEloResult(null);
    setAiTelemetry(null);
  };

  // Historical move viewer
  const handleSelectHistoryMove = (index: number) => {
    if (index >= 0 && index < boardSnapshots.length - 1) {
      setHistoryIndex(index);
      setBoard(boardSnapshots[index + 1]);
    }
  };

  // Opponent ELO mapping based on difficulty
  const opponentElo = gameMode === 'ai'
    ? aiLevel === 'easy'
      ? 1150
      : aiLevel === 'medium'
      ? 1450
      : aiLevel === 'hard'
      ? 1950
      : 2450
    : 1500;

  const lastPlayedMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between overflow-x-hidden selection:bg-amber-500 selection:text-stone-950">
      
      {/* App Header */}
      <header className="border-b border-stone-800/80 mat-surface-card px-2.5 sm:px-4 py-2.5 sm:py-3 sticky top-0 z-30 mat-elevation-2 overflow-hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center mat-elevation-2 font-piece text-lg sm:text-xl text-stone-950 font-black border border-amber-300/40 shrink-0">
              帥
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-extrabold tracking-tight text-stone-100 font-cinzel flex items-center gap-1.5 truncate">
                <span>KỲ VƯƠNG AI</span>
                <span className="hidden xs:inline text-[9px] sm:text-[10px] font-sans font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  ALPHA-BETA CORE
                </span>
              </h1>
              <p className="text-[10px] sm:text-[11px] text-stone-400 hidden md:block truncate">
                Đồ Án Môn Học Trí Tuệ Nhân Tạo • Alpha-Beta Pruning • Zobrist Hashing • ELO Ranking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Slide Presentation Button */}
            <button
              onClick={() => setIsPresentationOpen(true)}
              title="Xem slide báo cáo đồ án môn AI"
              className="mat-btn flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-violet-600/30 hover:from-purple-600/40 hover:to-violet-600/40 text-purple-200 border border-purple-500/40 text-[11px] sm:text-xs font-bold mat-elevation-1 cursor-pointer shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
              <span className="hidden sm:inline">Slide Báo Cáo AI</span>
              <span className="sm:hidden">Slide AI</span>
            </button>

            {/* Profile / Elo button */}
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="mat-btn flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-600/20 to-amber-500/20 hover:from-amber-600/30 hover:to-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-semibold mat-elevation-1 cursor-pointer shrink-0"
            >
              <span className="text-xs sm:text-sm">{playerStats.avatar}</span>
              <span className="font-mono">{playerStats.elo} Elo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-2 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 items-start overflow-x-hidden">
        
        {/* Left / Center Area: Board & Immediate Controls */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          
          {/* Opponent Player Card (Black) with authentic rank badge */}
          <PlayerCard
            color="black"
            isAI={gameMode === 'ai'}
            isCurrentTurn={turn === 'black'}
            name={gameMode === 'ai' ? `Kỳ Vương AI` : 'Kỳ Thủ 2'}
            capturedPieces={capturedRed}
            timerSeconds={timerBlack}
            elo={opponentElo}
            levelLabel={
              gameMode === 'ai'
                ? aiLevel === 'easy'
                  ? 'Dễ'
                  : aiLevel === 'medium'
                  ? 'Trung Bình'
                  : aiLevel === 'hard'
                  ? 'Khó'
                  : 'Cao Thủ'
                : undefined
            }
            isThinking={isAiThinking}
          />

          {/* Real-time Advantage Evaluation Bar */}
          <EvaluationBar
            score={evalScore}
            isCheck={isCurrentInCheck}
            isCheckmate={!!gameResult}
            turn={turn}
          />

          {/* Tactical Hint Banner */}
          {hint && (
            <HintBanner
              hint={hint}
              onApply={handleApplyHint}
              onClose={() => setHint(null)}
            />
          )}

          {/* 2D Vector Xiangqi Board */}
          <Board
            board={board}
            selectedPos={selectedPos}
            validMoves={validMoves}
            lastMove={lastPlayedMove}
            hint={hint}
            checkPos={checkedKingPos}
            flipped={flipped}
            showLabels={showLabels}
            onSquareClick={handleSquareClick}
          />

          {/* Player Card (Red - User) with authentic rank badge */}
          <PlayerCard
            color="red"
            isAI={false}
            isCurrentTurn={turn === 'red'}
            name={playerStats.name}
            capturedPieces={capturedBlack}
            timerSeconds={timerRed}
            elo={playerStats.elo}
          />

          {/* Controls Bar */}
          <GameControls
            gameMode={gameMode}
            aiLevel={aiLevel}
            canUndo={moveHistory.length > 0}
            canRedo={historyIndex < moveHistory.length - 1}
            isAiThinking={isAiThinking}
            isHintLoading={isHintLoading}
            isSoundEnabled={isSoundEnabled}
            showLabels={showLabels}
            onChangeMode={mode => {
              setGameMode(mode);
              handleNewGame();
            }}
            onChangeLevel={lvl => setAiLevel(lvl)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onHint={handleRequestHint}
            onNewGame={handleNewGame}
            onFlipBoard={() => setFlipped(!flipped)}
            onToggleSound={() => setIsSoundEnabled(sound.toggle())}
            onToggleLabels={() => setShowLabels(!showLabels)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        </div>

        {/* Right Sidebar: Move Notation & AI Engine Telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* History Panel */}
          <div className="h-[280px] sm:h-[320px] lg:h-[360px]">
            <HistoryPanel
              moves={moveHistory}
              currentIndex={historyIndex}
              onSelectMove={handleSelectHistoryMove}
              onFirst={() => handleSelectHistoryMove(-1)}
              onPrev={() => handleSelectHistoryMove(Math.max(-1, historyIndex - 1))}
              onNext={() => handleSelectHistoryMove(Math.min(moveHistory.length - 1, historyIndex + 1))}
              onLast={() => handleSelectHistoryMove(moveHistory.length - 1)}
            />
          </div>

          {/* AI Search Diagnostics & Telemetry Card */}
          <div className="p-3.5 bg-stone-900/90 rounded-2xl border border-stone-800 text-xs space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                <span>⚡</span> AI Engine Diagnostics
              </h4>
              <button
                onClick={() => setIsPresentationOpen(true)}
                className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold underline flex items-center gap-0.5"
              >
                Xem chi tiết slide
              </button>
            </div>

            {aiTelemetry ? (
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
                <div className="p-2 bg-stone-950 rounded-lg border border-stone-800">
                  <div className="text-amber-400 font-bold">Tầng {aiTelemetry.depth}</div>
                  <div className="text-[9px] text-stone-500 font-sans">Độ sâu (Depth)</div>
                </div>

                <div className="p-2 bg-stone-950 rounded-lg border border-stone-800">
                  <div className="text-emerald-400 font-bold">{aiTelemetry.nodesSearched}</div>
                  <div className="text-[9px] text-stone-500 font-sans">Nút duyệt (Nodes)</div>
                </div>

                <div className="p-2 bg-stone-950 rounded-lg border border-stone-800">
                  <div className="text-cyan-400 font-bold">{aiTelemetry.timeMs}ms</div>
                  <div className="text-[9px] text-stone-500 font-sans">Thời gian (Time)</div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-stone-950/70 rounded-lg border border-stone-800/80 text-stone-400 text-[11px] text-center">
                Sẵn sàng. Hãy đi một nước để kích hoạt AI Alpha-Beta Engine.
              </div>
            )}

            <div className="pt-2 border-t border-stone-800/80 space-y-1 text-[11px] text-stone-300">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Thuật toán cốt lõi:</span>
                <span className="font-semibold text-purple-300">Negamax Alpha-Beta</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Bảng băm trạng thái:</span>
                <span className="font-semibold text-emerald-400">Zobrist Hashing O(1)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Tránh hiệu ứng chân trời:</span>
                <span className="font-semibold text-rose-300">Quiescence Search</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/60 py-2.5 px-4 text-center text-xs text-stone-500 bg-stone-950">
        Kỳ Vương AI • Đồ Án Môn Học Trí Tuệ Nhân Tạo (AI Course Project)
      </footer>

      {/* Game Over Modal */}
      <GameOverModal
        result={gameResult}
        isAiMode={gameMode === 'ai'}
        eloDelta={eloResult?.delta || 0}
        newElo={eloResult?.newElo || playerStats.elo}
        onNewGame={handleNewGame}
        onReview={() => setGameResult(null)}
        onOpenLeaderboard={() => {
          setGameResult(null);
          setIsLeaderboardOpen(true);
        }}
      />

      {/* Online Leaderboard & User Profile Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        playerStats={playerStats}
        onStatsUpdate={stats => setPlayerStats(stats)}
      />

      {/* Interactive AI Project Presentation Modal */}
      <AiPresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
