import React from 'react';

interface EvaluationBarProps {
  score: number; // Positive = Red advantage, Negative = Black advantage
  isCheck: boolean;
  isCheckmate: boolean;
  turn: 'red' | 'black';
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  score,
  isCheck,
  isCheckmate,
  turn,
}) => {
  // Normalize score to percentage (-2000 to +2000 -> 0% to 100%)
  const clamped = Math.max(-2000, Math.min(2000, score));
  const redPercentage = Math.round(50 + (clamped / 2000) * 45);

  const formattedScore = Math.abs(score / 100).toFixed(1);
  const advantageText = isCheckmate
    ? turn === 'red' ? 'Đen chiếu bí!' : 'Đỏ chiếu bí!'
    : isCheck
    ? `${turn === 'red' ? 'Đỏ' : 'Đen'} bị chiếu!`
    : Math.abs(score) < 30
    ? 'Cân bằng'
    : score > 0
    ? `Đỏ ưu (+${formattedScore})`
    : `Đen ưu (+${formattedScore})`;

  return (
    <div className="w-full max-w-[500px] mx-auto flex flex-col gap-1 px-1 overflow-hidden">
      <div className="flex items-center justify-between text-[10px] sm:text-xs font-medium text-stone-300">
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700 inline-block" />
          <span className="text-stone-400">Đen ({100 - redPercentage}%)</span>
        </div>
        <span
          className={`font-semibold tracking-wide text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full truncate max-w-[140px] sm:max-w-none text-center ${
            isCheck
              ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
              : 'bg-stone-800 text-stone-300 border border-stone-700'
          }`}
        >
          {advantageText}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-red-400">Đỏ ({redPercentage}%)</span>
          <span className="w-2 h-2 rounded-full bg-red-600 border border-red-400 inline-block" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1.5 sm:h-2 rounded-full overflow-hidden bg-slate-800 border border-stone-700 flex shadow-inner">
        {/* Black side */}
        <div
          className="h-full bg-gradient-to-r from-slate-950 to-slate-800 transition-all duration-300"
          style={{ width: `${100 - redPercentage}%` }}
        />
        {/* Red side */}
        <div
          className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-300"
          style={{ width: `${redPercentage}%` }}
        />
        {/* Center balance line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-amber-400/80 -translate-x-1/2 z-10" />
      </div>
    </div>
  );
};
