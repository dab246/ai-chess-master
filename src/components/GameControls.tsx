import React from 'react';
import { GameMode, AILevel } from '../types/chess';
import {
  RotateCcw,
  Undo2,
  Redo2,
  Lightbulb,
  ArrowUpDown,
  Volume2,
  VolumeX,
  Trophy,
  SlidersHorizontal,
  Bot,
  Users,
} from 'lucide-react';

interface GameControlsProps {
  gameMode: GameMode;
  aiLevel: AILevel;
  canUndo: boolean;
  canRedo: boolean;
  isAiThinking: boolean;
  isHintLoading: boolean;
  isSoundEnabled: boolean;
  showLabels: boolean;
  onChangeMode: (mode: GameMode) => void;
  onChangeLevel: (level: AILevel) => void;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onNewGame: () => void;
  onFlipBoard: () => void;
  onToggleSound: () => void;
  onToggleLabels: () => void;
  onOpenLeaderboard: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  aiLevel,
  canUndo,
  canRedo,
  isAiThinking,
  isHintLoading,
  isSoundEnabled,
  showLabels,
  onChangeMode,
  onChangeLevel,
  onUndo,
  onRedo,
  onHint,
  onNewGame,
  onFlipBoard,
  onToggleSound,
  onToggleLabels,
  onOpenLeaderboard,
}) => {
  return (
    <div className="w-full max-w-[500px] mx-auto flex flex-col gap-2 overflow-hidden">
      {/* Top Bar: Mode, Level & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 sm:p-2 mat-surface-card rounded-xl mat-elevation-2">
        
        {/* Game Mode Toggle */}
        <div className="flex items-center p-0.5 bg-stone-950/80 rounded-lg border border-stone-800 shrink-0">
          <button
            onClick={() => onChangeMode('ai')}
            className={`mat-btn flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold cursor-pointer ${
              gameMode === 'ai'
                ? 'bg-amber-600 text-white mat-elevation-1'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 shrink-0" />
            <span>Đấu AI</span>
          </button>
          <button
            onClick={() => onChangeMode('pvp')}
            className={`mat-btn flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold cursor-pointer ${
              gameMode === 'pvp'
                ? 'bg-amber-600 text-white mat-elevation-1'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>2 Người</span>
          </button>
        </div>

        {/* AI Level Selection */}
        {gameMode === 'ai' && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] sm:text-[11px] text-stone-400 hidden xs:inline flex items-center gap-0.5">
              <SlidersHorizontal className="w-3 h-3" /> Cấp độ:
            </span>
            <select
              value={aiLevel}
              onChange={e => onChangeLevel(e.target.value as AILevel)}
              className="bg-stone-950/90 text-amber-400 border border-stone-800 rounded-lg px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs font-semibold outline-none focus:border-amber-500 cursor-pointer mat-elevation-1"
            >
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó (AI)</option>
              <option value="expert">Rất khó</option>
            </select>
          </div>
        )}

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={isSoundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="mat-btn p-1 sm:p-1.5 rounded-lg bg-stone-950/80 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors cursor-pointer"
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />}
          </button>

          {/* Toggle Labels */}
          <button
            onClick={onToggleLabels}
            title={showLabels ? 'Tắt phụ đề tiếng Việt' : 'Bật phụ đề tiếng Việt'}
            className={`mat-btn px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold border transition-colors cursor-pointer ${
              showLabels
                ? 'bg-amber-600/20 text-amber-300 border-amber-600/40'
                : 'bg-stone-950/80 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            {showLabels ? 'Từ Việt' : 'Hán Tự'}
          </button>

          {/* Leaderboard trigger */}
          <button
            onClick={onOpenLeaderboard}
            title="Bảng xếp hạng"
            className="mat-btn flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden xs:inline">Hạng</span>
          </button>
        </div>
      </div>

      {/* Main 5 Action Buttons (Grid 5 with responsive text and no overflow) */}
      <div className="grid grid-cols-5 gap-1 sm:gap-1.5 p-1.5 sm:p-2 mat-surface-card rounded-xl mat-elevation-2">
        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo || isAiThinking}
          title="Xin đi lại nước trước"
          className="mat-btn flex flex-col items-center justify-center py-1.5 sm:py-2 px-0.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-[10px] sm:text-[11px] font-semibold disabled:opacity-30 cursor-pointer overflow-hidden mat-elevation-1"
        >
          <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 text-stone-300 shrink-0" />
          <span className="truncate w-full text-center">Hoãn đi</span>
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo || isAiThinking}
          title="Đi tiếp nước đã hoãn"
          className="mat-btn flex flex-col items-center justify-center py-1.5 sm:py-2 px-0.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-[10px] sm:text-[11px] font-semibold disabled:opacity-30 cursor-pointer overflow-hidden mat-elevation-1"
        >
          <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 text-stone-300 shrink-0" />
          <span className="truncate w-full text-center">Đi tiếp</span>
        </button>

        {/* Hint */}
        <button
          onClick={onHint}
          disabled={isAiThinking || isHintLoading}
          title="Nhờ AI gợi ý nước cờ tối ưu"
          className="mat-btn flex flex-col items-center justify-center py-1.5 sm:py-2 px-0.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/40 text-[10px] sm:text-[11px] font-semibold disabled:opacity-40 cursor-pointer overflow-hidden mat-elevation-2"
        >
          <Lightbulb className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 shrink-0 ${isHintLoading ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
          <span className="truncate w-full text-center">{isHintLoading ? 'Tính...' : 'Gợi ý'}</span>
        </button>

        {/* Flip Board */}
        <button
          onClick={onFlipBoard}
          title="Đổi chiều bàn cờ"
          className="mat-btn flex flex-col items-center justify-center py-1.5 sm:py-2 px-0.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-[10px] sm:text-[11px] font-semibold cursor-pointer overflow-hidden mat-elevation-1"
        >
          <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 text-stone-300 shrink-0" />
          <span className="truncate w-full text-center">Đổi góc</span>
        </button>

        {/* New Game */}
        <button
          onClick={onNewGame}
          disabled={isAiThinking}
          title="Bắt đầu ván cờ mới"
          className="mat-btn flex flex-col items-center justify-center py-1.5 sm:py-2 px-0.5 rounded-lg bg-amber-900/70 hover:bg-amber-800/90 text-amber-200 border border-amber-600/50 text-[10px] sm:text-[11px] font-semibold cursor-pointer overflow-hidden mat-elevation-2"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-0.5 text-amber-400 shrink-0" />
          <span className="truncate w-full text-center">Ván mới</span>
        </button>
      </div>
    </div>
  );
};
