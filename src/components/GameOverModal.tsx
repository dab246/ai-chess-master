import React from 'react';
import { GameResult } from '../types/chess';
import { Trophy, Frown, Equal, RotateCcw, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { RankBadge } from './RankBadge';

interface GameOverModalProps {
  result: GameResult;
  isAiMode: boolean;
  eloDelta: number;
  newElo: number;
  onNewGame: () => void;
  onReview: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  result,
  isAiMode,
  eloDelta,
  newElo,
  onNewGame,
  onReview,
  onOpenLeaderboard,
}) => {
  if (!result) return null;

  const isWin = result === 'red_win';
  const isLoss = result === 'black_win';
  const isDraw = result === 'draw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm mat-surface-card border border-stone-800/80 rounded-2xl mat-elevation-5 overflow-hidden p-6 text-center space-y-4">
        
        {/* Result Icon */}
        <div className="flex justify-center">
          {isWin ? (
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center shadow-lg animate-bounce mat-elevation-3">
              <Trophy className="w-9 h-9" />
            </div>
          ) : isLoss ? (
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center shadow-lg mat-elevation-3">
              <Frown className="w-9 h-9" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-stone-700/40 border-2 border-stone-500 text-stone-300 flex items-center justify-center shadow-lg mat-elevation-3">
              <Equal className="w-9 h-9" />
            </div>
          )}
        </div>

        {/* Title and details */}
        <div>
          <h2 className="text-xl font-black text-stone-100">
            {isWin ? 'Chiến Thắng!' : isLoss ? 'Thất Bại' : 'Hòa Cờ!'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {isWin
              ? 'Nước cờ xuất sắc! Bạn đã đánh bại đối thủ một cách thuyết phục.'
              : isLoss
              ? 'Tướng quân đã bị chiếu bí. Hãy phân tích lại ván cờ để rút kinh nghiệm!'
              : 'Trận cờ bất phân thắng bại, cả hai bên đều thi triển mưu trí cân bằng.'}
          </p>
        </div>

        {/* Current rank badge */}
        <div className="flex justify-center">
          <RankBadge elo={newElo} size="md" showElo={true} />
        </div>

        {/* Elo delta badge */}
        {isAiMode && (
          <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 flex items-center justify-between mat-elevation-1">
            <span className="text-xs text-stone-400">Thay đổi điểm Elo:</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold font-mono flex items-center gap-0.5 ${
                  eloDelta > 0
                    ? 'text-emerald-400'
                    : eloDelta < 0
                    ? 'text-red-400'
                    : 'text-stone-400'
                }`}
              >
                {eloDelta > 0 ? (
                  <>
                    <ArrowUp className="w-3.5 h-3.5" />+{eloDelta}
                  </>
                ) : eloDelta < 0 ? (
                  <>
                    <ArrowDown className="w-3.5 h-3.5" />
                    {eloDelta}
                  </>
                ) : (
                  '0'
                )}
              </span>
              <span className="text-xs text-stone-500 font-mono">→ {newElo} Elo</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onNewGame}
            className="mat-btn w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs mat-elevation-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Ván Mới</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onReview}
              className="mat-btn py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer mat-elevation-1"
            >
              <Eye className="w-4 h-4" />
              <span>Xem Lại Cờ</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="mat-btn py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer mat-elevation-1"
            >
              <Trophy className="w-4 h-4" />
              <span>Bảng Xếp Hạng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
