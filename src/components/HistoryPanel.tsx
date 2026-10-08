import React, { useEffect, useRef } from 'react';
import { Move } from '../types/chess';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast, ScrollText, Copy, Check } from 'lucide-react';

interface HistoryPanelProps {
  moves: Move[];
  currentIndex: number;
  onSelectMove: (index: number) => void;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  moves,
  currentIndex,
  onSelectMove,
  onFirst,
  onPrev,
  onNext,
  onLast,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Group moves into pairs (Red move, Black move)
  const rounds: { round: number; red?: Move; redIdx?: number; black?: Move; blackIdx?: number }[] = [];
  for (let i = 0; i < moves.length; i++) {
    const roundIdx = Math.floor(i / 2);
    if (!rounds[roundIdx]) {
      rounds[roundIdx] = { round: roundIdx + 1 };
    }
    if (i % 2 === 0) {
      rounds[roundIdx].red = moves[i];
      rounds[roundIdx].redIdx = i;
    } else {
      rounds[roundIdx].black = moves[i];
      rounds[roundIdx].blackIdx = i;
    }
  }

  // Auto-scroll down when new move is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [moves.length]);

  const handleCopyHistory = () => {
    if (moves.length === 0) return;
    const text = rounds
      .map(r => `${r.round}. ${r.red ? r.red.notation : ''} ${r.black ? r.black.notation : ''}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-stone-900/90 rounded-2xl border border-stone-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:py-2.5 border-b border-stone-800 bg-stone-950/60 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <ScrollText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
          <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-200 truncate">
            Biên Bản Ván Đấu ({moves.length} nước)
          </h3>
        </div>

        <button
          onClick={handleCopyHistory}
          disabled={moves.length === 0}
          title="Sao chép biên bản"
          className="flex items-center gap-1 text-[11px] font-medium text-stone-400 hover:text-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 ml-1 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Chép</span>
            </>
          )}
        </button>
      </div>

      {/* Move list */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-1.5 sm:p-2 space-y-1 text-xs select-none max-h-[180px] sm:max-h-[220px]"
      >
        {rounds.length === 0 ? (
          <div className="h-full flex items-center justify-center text-stone-500 text-xs py-6">
            Chưa có nước cờ nào được đi
          </div>
        ) : (
          rounds.map(r => (
            <div
              key={`round-${r.round}`}
              className="grid grid-cols-12 gap-1 items-center py-1 px-1 rounded-lg hover:bg-stone-800/40 text-[11px] sm:text-[12px]"
            >
              <span className="col-span-2 text-stone-500 font-mono text-center truncate">
                {r.round}.
              </span>

              {/* Red Move */}
              <button
                onClick={() => r.redIdx !== undefined && onSelectMove(r.redIdx)}
                className={`col-span-5 text-left px-1.5 py-0.5 sm:py-1 rounded transition-colors truncate cursor-pointer ${
                  r.redIdx === currentIndex
                    ? 'bg-amber-600/30 text-amber-300 font-semibold border border-amber-500/40'
                    : 'text-red-400 hover:bg-stone-800/80'
                }`}
                title={r.red ? r.red.notation : ''}
              >
                {r.red ? r.red.notation : ''}
              </button>

              {/* Black Move */}
              <button
                onClick={() => r.blackIdx !== undefined && onSelectMove(r.blackIdx)}
                disabled={r.blackIdx === undefined}
                className={`col-span-5 text-left px-1.5 py-0.5 sm:py-1 rounded transition-colors truncate cursor-pointer ${
                  r.blackIdx === currentIndex
                    ? 'bg-amber-600/30 text-amber-300 font-semibold border border-amber-500/40'
                    : 'text-stone-300 hover:bg-stone-800/80 disabled:opacity-0'
                }`}
                title={r.black ? r.black.notation : ''}
              >
                {r.black ? r.black.notation : ''}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Replay navigation bar */}
      <div className="flex items-center justify-between p-1.5 sm:p-2 border-t border-stone-800 bg-stone-950/70 shrink-0">
        <button
          onClick={onFirst}
          disabled={currentIndex < 0}
          title="Nước đầu tiên"
          className="p-1 sm:p-1.5 rounded-lg bg-stone-800/60 hover:bg-stone-700 text-stone-300 disabled:opacity-30 transition-colors cursor-pointer"
        >
          <ChevronFirst className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={onPrev}
          disabled={currentIndex < 0}
          title="Nước trước"
          className="p-1 sm:p-1.5 rounded-lg bg-stone-800/60 hover:bg-stone-700 text-stone-300 disabled:opacity-30 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <span className="text-[10px] sm:text-[11px] font-mono text-stone-400">
          {currentIndex + 1} / {moves.length}
        </span>

        <button
          onClick={onNext}
          disabled={currentIndex >= moves.length - 1}
          title="Nước kế tiếp"
          className="p-1 sm:p-1.5 rounded-lg bg-stone-800/60 hover:bg-stone-700 text-stone-300 disabled:opacity-30 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={onLast}
          disabled={currentIndex >= moves.length - 1}
          title="Nước mới nhất"
          className="p-1 sm:p-1.5 rounded-lg bg-stone-800/60 hover:bg-stone-700 text-stone-300 disabled:opacity-30 transition-colors cursor-pointer"
        >
          <ChevronLast className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
