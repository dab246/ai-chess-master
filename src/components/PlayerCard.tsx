import React from 'react';
import { Piece, PieceColor } from '../types/chess';
import { PIECE_NAMES } from '../engine/rules';
import { Bot, User, Clock } from 'lucide-react';
import { RankBadge } from './RankBadge';

interface PlayerCardProps {
  color: PieceColor;
  isAI: boolean;
  isCurrentTurn: boolean;
  name: string;
  capturedPieces: Piece[];
  timerSeconds: number;
  levelLabel?: string;
  isThinking?: boolean;
  elo?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  color,
  isAI,
  isCurrentTurn,
  name,
  capturedPieces,
  timerSeconds,
  levelLabel,
  isThinking,
  elo,
}) => {
  const isRed = color === 'red';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-2xl transition-all duration-200 border overflow-hidden mat-surface-card ${
        isCurrentTurn
          ? isRed
            ? 'bg-gradient-to-r from-red-950/80 via-stone-900/90 to-red-950/50 border-red-500/70 mat-elevation-3 ring-1 ring-red-500/40'
            : 'bg-gradient-to-r from-stone-900/90 via-amber-950/50 to-stone-900/90 border-amber-500/70 mat-elevation-3 ring-1 ring-amber-500/40'
          : 'bg-stone-900/60 border-stone-800/80 opacity-85 mat-elevation-1'
      }`}
    >
      {/* Left Info Section */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 mr-2">
        {/* Avatar Disc */}
        <div
          className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 shadow-md shrink-0 ${
            isRed
              ? 'bg-gradient-to-br from-red-900/60 to-red-950 border-red-500 text-red-200 shadow-red-900/50'
              : 'bg-gradient-to-br from-stone-800 to-stone-900 border-amber-500/70 text-stone-200 shadow-stone-950/50'
          }`}
        >
          {isAI ? (
            <Bot className={`w-4 h-4 sm:w-5 sm:h-5 ${isThinking ? 'animate-bounce text-amber-400' : 'text-stone-300'}`} />
          ) : (
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300" />
          )}

          {/* Turn indicator pulse */}
          {isCurrentTurn && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-stone-900 animate-ping" />
          )}
        </div>

        {/* Player Name and Badges */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-black text-stone-100 tracking-tight truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[200px]">
              {name}
            </span>

            {/* Rank Badge Chip */}
            {elo !== undefined && (
              <div className="shrink-0">
                <RankBadge elo={elo} size="sm" showElo={true} />
              </div>
            )}

            {levelLabel && !elo && (
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 bg-stone-800 text-amber-400 rounded font-mono border border-stone-700 font-semibold shrink-0">
                {levelLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-stone-400 truncate">
            <span className={`font-semibold shrink-0 ${isRed ? 'text-red-400' : 'text-stone-300'}`}>
              {isRed ? 'Phe Đỏ' : 'Phe Đen'}
            </span>
            {isThinking ? (
              <span className="text-amber-400 text-[10px] font-medium animate-pulse flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                <span className="truncate">Đang tính Alpha-Beta...</span>
              </span>
            ) : (
              <span className="opacity-75 hidden xs:inline">• {isRed ? 'Đi trước' : 'Đi sau'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Captured Pieces Tray & Timer */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Captured Pieces Mini Tray (responsive hiding on tight screens) */}
        <div className="hidden xs:flex items-center gap-0.5 max-w-[90px] sm:max-w-[130px] overflow-hidden justify-end">
          {capturedPieces.slice(-5).map((piece, idx) => (
            <span
              key={`cap-${idx}`}
              className={`text-[11px] sm:text-xs font-piece font-bold px-1 py-0.5 rounded shrink-0 ${
                piece.color === 'red'
                  ? 'text-red-300 bg-red-950/80 border border-red-800/60'
                  : 'text-stone-300 bg-stone-800 border border-stone-700/60'
              }`}
              title={PIECE_NAMES[piece.type].vi}
            >
              {piece.color === 'red' ? PIECE_NAMES[piece.type].red : PIECE_NAMES[piece.type].black}
            </span>
          ))}
          {capturedPieces.length > 5 && (
            <span className="text-[9px] text-stone-400 font-mono font-bold shrink-0">
              +{capturedPieces.length - 5}
            </span>
          )}
        </div>

        {/* Turn Timer */}
        <div className="flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-stone-950/80 rounded-lg sm:rounded-xl border border-stone-800 font-mono text-xs sm:text-sm text-amber-400 shadow-inner shrink-0">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-500" />
          <span>{formatTime(timerSeconds)}</span>
        </div>
      </div>
    </div>
  );
};
