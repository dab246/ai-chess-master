import React from 'react';
import { HintResult } from '../types/chess';
import { Lightbulb, Check, X } from 'lucide-react';

interface HintBannerProps {
  hint: HintResult | null;
  onApply: () => void;
  onClose: () => void;
}

export const HintBanner: React.FC<HintBannerProps> = ({ hint, onApply, onClose }) => {
  if (!hint) return null;

  return (
    <div className="w-full max-w-[500px] mx-auto p-2.5 sm:p-3 bg-gradient-to-r from-emerald-950/95 via-stone-900/95 to-emerald-950/95 border border-emerald-500/50 rounded-xl shadow-xl flex items-center justify-between gap-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
        <div className="p-1.5 sm:p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-300 truncate">
              Gợi ý Alpha-Beta (Độ sâu {hint.depth})
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-600/30 shrink-0">
              {hint.score > 0 ? `+${hint.score}` : hint.score}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-stone-200 truncate font-medium mt-0.5">
            {hint.reason}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-1">
        <button
          onClick={onApply}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-semibold shadow-md transition-colors cursor-pointer shrink-0"
        >
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>Đi ngay</span>
        </button>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
