import React, { useMemo, useState } from 'react';
import { Board as BoardType, Piece, Position, Move, HintResult } from '../types/chess';
import { PIECE_NAMES } from '../engine/rules';

interface BoardProps {
  board: BoardType;
  selectedPos: Position | null;
  validMoves: Position[];
  lastMove: Move | null;
  hint: HintResult | null;
  checkPos: Position | null;
  flipped: boolean;
  showLabels: boolean;
  onSquareClick: (r: number, c: number) => void;
  disabled?: boolean;
}

// Marker crosses on traditional Xiangqi board
const STAR_POINTS = [
  // Cannons
  { r: 2, c: 1 }, { r: 2, c: 7 },
  { r: 7, c: 1 }, { r: 7, c: 7 },
  // Pawns
  { r: 3, c: 0 }, { r: 3, c: 2 }, { r: 3, c: 4 }, { r: 3, c: 6 }, { r: 3, c: 8 },
  { r: 6, c: 0 }, { r: 6, c: 2 }, { r: 6, c: 4 }, { r: 6, c: 6 }, { r: 6, c: 8 },
];

export const Board: React.FC<BoardProps> = ({
  board,
  selectedPos,
  validMoves,
  lastMove,
  hint,
  checkPos,
  flipped,
  showLabels,
  onSquareClick,
}) => {
  // Material Touch Ripple state
  const [activeRipple, setActiveRipple] = useState<{ r: number; c: number; id: number } | null>(null);

  const handleSquareTap = (r: number, c: number) => {
    setActiveRipple({ r, c, id: Date.now() });
    onSquareClick(r, c);
  };

  const validMovesMap = useMemo(() => {
    const map = new Map<string, boolean>();
    validMoves.forEach(m => map.set(`${m.r},${m.c}`, true));
    return map;
  }, [validMoves]);

  return (
    <div className="relative w-full max-w-[500px] mx-auto select-none p-2 sm:p-3 rounded-2xl bg-amber-950/70 mat-elevation-4 border-4 border-amber-800/80 backdrop-blur-md overflow-hidden">
      {/* Wooden Board Container with Aspect Ratio 9:10 */}
      <div className="relative w-full aspect-[9/10] bg-board-wood rounded-xl mat-elevation-2 overflow-hidden border-2 border-amber-900/50">
        
        {/* SVG Grid Lines, River, Palace, and Markers */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 900 1000"
          preserveAspectRatio="none"
        >
          {/* Outer Border */}
          <rect
            x="50"
            y="50"
            width="800"
            height="900"
            fill="none"
            stroke="#5c3a21"
            strokeWidth="3.5"
          />

          {/* Inner Double Rim */}
          <rect
            x="44"
            y="44"
            width="812"
            height="912"
            fill="none"
            stroke="#784b28"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />

          {/* 10 Horizontal Lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="50"
              y1={50 + i * 100}
              x2="850"
              y2={50 + i * 100}
              stroke="#5c3a21"
              strokeWidth="2"
            />
          ))}

          {/* 9 Vertical Lines */}
          <line x1="50" y1="50" x2="50" y2="950" stroke="#5c3a21" strokeWidth="2.5" />
          <line x1="850" y1="50" x2="850" y2="950" stroke="#5c3a21" strokeWidth="2.5" />

          {/* 7 Internal vertical lines: upper half (0 to 4) and lower half (5 to 9) */}
          {Array.from({ length: 7 }).map((_, i) => {
            const x = 50 + (i + 1) * 100;
            return (
              <React.Fragment key={`v-upper-${i}`}>
                <line x1={x} y1="50" x2={x} y2="450" stroke="#5c3a21" strokeWidth="2" />
                <line x1={x} y1="550" x2={x} y2="950" stroke="#5c3a21" strokeWidth="2" />
              </React.Fragment>
            );
          })}

          {/* Palaces Diagonal Crosses (Cung Tướng) */}
          {/* Top Palace (Rows 0-2, Cols 3-5) */}
          <line x1="350" y1="50" x2="550" y2="250" stroke="#5c3a21" strokeWidth="1.8" />
          <line x1="550" y1="50" x2="350" y2="250" stroke="#5c3a21" strokeWidth="1.8" />

          {/* Bottom Palace (Rows 7-9, Cols 3-5) */}
          <line x1="350" y1="750" x2="550" y2="950" stroke="#5c3a21" strokeWidth="1.8" />
          <line x1="550" y1="750" x2="350" y2="950" stroke="#5c3a21" strokeWidth="1.8" />

          {/* River Text: SỞ HÀ - HÁN GIỚI (楚河 漢界) */}
          <g fill="#6a401f" className="select-none font-piece">
            <text
              x="200"
              y="515"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="34"
              fontWeight="900"
              letterSpacing="14"
              opacity="0.85"
            >
              {flipped ? '漢界' : '楚河'}
            </text>
            <text
              x="200"
              y="538"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fontWeight="600"
              letterSpacing="4"
              opacity="0.6"
              fontFamily="sans-serif"
            >
              {flipped ? 'HÁN GIỚI' : 'SỞ HÀ'}
            </text>

            <text
              x="700"
              y="515"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="34"
              fontWeight="900"
              letterSpacing="14"
              opacity="0.85"
            >
              {flipped ? '楚河' : '漢界'}
            </text>
            <text
              x="700"
              y="538"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fontWeight="600"
              letterSpacing="4"
              opacity="0.6"
              fontFamily="sans-serif"
            >
              {flipped ? 'SỞ HÀ' : 'HÁN GIỚI'}
            </text>
          </g>

          {/* Traditional Star Mark Crosses */}
          {STAR_POINTS.map(({ r, c }, idx) => {
            const cx = 50 + c * 100;
            const cy = 50 + r * 100;
            const d = 5;
            const len = 12;

            return (
              <g key={`star-${idx}`} stroke="#5c3a21" strokeWidth="1.5" opacity="0.65">
                {c > 0 && (
                  <path d={`M ${cx - d - len} ${cy - d} L ${cx - d} ${cy - d} L ${cx - d} ${cy - d - len}`} fill="none" />
                )}
                {c < 8 && (
                  <path d={`M ${cx + d + len} ${cy - d} L ${cx + d} ${cy - d} L ${cx + d} ${cy - d - len}`} fill="none" />
                )}
                {c > 0 && (
                  <path d={`M ${cx - d - len} ${cy + d} L ${cx - d} ${cy + d} L ${cx - d} ${cy + d + len}`} fill="none" />
                )}
                {c < 8 && (
                  <path d={`M ${cx + d + len} ${cy + d} L ${cx + d} ${cy + d} L ${cx + d} ${cy + d + len}`} fill="none" />
                )}
              </g>
            );
          })}
        </svg>

        {/* Board Clickable 10x9 Grid Overlay */}
        <div className="absolute inset-0 grid grid-rows-10 grid-cols-9">
          {Array.from({ length: 10 }).map((_, rIdx) =>
            Array.from({ length: 9 }).map((_, cIdx) => {
              const actualR = flipped ? 9 - rIdx : rIdx;
              const actualC = flipped ? 8 - cIdx : cIdx;
              const isSelected = selectedPos?.r === actualR && selectedPos?.c === actualC;
              const isValid = validMovesMap.get(`${actualR},${actualC}`);
              const pieceOnSquare = board[actualR][actualC];
              const isCaptureTarget = isValid && !!pieceOnSquare;

              const isLastMoveFrom = lastMove?.from.r === actualR && lastMove?.from.c === actualC;
              const isLastMoveTo = lastMove?.to.r === actualR && lastMove?.to.c === actualC;

              const isHintFrom = hint?.from.r === actualR && hint?.from.c === actualC;
              const isHintTo = hint?.to.r === actualR && hint?.to.c === actualC;

              const isChecked = checkPos?.r === actualR && checkPos?.c === actualC;
              const hasRipple = activeRipple?.r === actualR && activeRipple?.c === actualC;

              return (
                <div
                  key={`sq-${rIdx}-${cIdx}`}
                  onClick={() => handleSquareTap(actualR, actualC)}
                  className="relative w-full h-full flex items-center justify-center cursor-pointer transition-colors duration-150 select-none overflow-hidden"
                  style={{ touchAction: 'manipulation' }}
                >
                  {/* Material Touch Ripple on Click */}
                  {hasRipple && (
                    <span
                      key={activeRipple.id}
                      className="absolute w-8 h-8 rounded-full bg-amber-500/35 pointer-events-none animate-mat-ripple"
                    />
                  )}

                  {/* Last Move Highlighting with Material subtle glow */}
                  {(isLastMoveFrom || isLastMoveTo) && (
                    <div className="absolute w-[82%] h-[82%] rounded-full border-2 border-amber-600/70 bg-amber-500/15 pointer-events-none mat-elevation-1" />
                  )}

                  {/* King In Check Pulsing Ring */}
                  {isChecked && (
                    <div className="absolute w-[94%] h-[94%] rounded-full bg-red-600/40 border-2 border-red-500 check-pulse pointer-events-none" />
                  )}

                  {/* Hint Destination Glow */}
                  {isHintTo && (
                    <div className="absolute w-[86%] h-[86%] rounded-full border-2 border-emerald-500 bg-emerald-500/25 animate-pulse pointer-events-none flex items-center justify-center">
                      <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                    </div>
                  )}

                  {/* Valid Move Destination Indicator (Material Target Pip) */}
                  {isValid && !isCaptureTarget && (
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-600/90 rounded-full shadow-md transform hover:scale-125 transition-transform duration-150 pointer-events-none ring-2 ring-emerald-400/50 mat-elevation-1" />
                  )}

                  {/* Valid Move Capture Target Ring */}
                  {isCaptureTarget && (
                    <div className="absolute w-[88%] h-[88%] rounded-full border-2 border-red-600 bg-red-500/25 animate-pulse pointer-events-none mat-elevation-2" />
                  )}

                  {/* Piece Rendering */}
                  {pieceOnSquare && (
                    <PieceView
                      piece={pieceOnSquare}
                      isSelected={isSelected}
                      isHint={isHintFrom}
                      showLabel={showLabels}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

interface PieceViewProps {
  piece: Piece;
  isSelected: boolean;
  isHint: boolean;
  showLabel: boolean;
}

const PieceView: React.FC<PieceViewProps> = React.memo(({ piece, isSelected, isHint, showLabel }) => {
  const isRed = piece.color === 'red';
  const nameData = PIECE_NAMES[piece.type];
  const char = isRed ? nameData.red : nameData.black;
  const label = nameData.vi;

  return (
    <div
      className={`relative w-[86%] h-[86%] max-w-[46px] max-h-[46px] rounded-full flex flex-col items-center justify-center piece-shadow select-none pointer-events-none transition-all duration-200 ${
        isSelected ? 'piece-selected z-20' : 'z-10'
      } ${isHint ? 'piece-hint z-20' : ''}`}
      style={{
        // Physical convex lacquer disc with radial specular light highlight at 30% top-left
        background: isRed
          ? 'radial-gradient(circle at 32% 30%, #fff7ed 0%, #ffedd5 40%, #fed7aa 75%, #f97316 100%)'
          : 'radial-gradient(circle at 32% 30%, #f8fafc 0%, #e2e8f0 40%, #cbd5e1 75%, #64748b 100%)',
        border: isRed ? '3px solid #dc2626' : '3px solid #334155',
        boxShadow: isRed
          ? 'inset 0 1px 3px rgba(255,255,255,0.9), inset 0 -3px 4px rgba(185, 28, 28, 0.45), 0 4px 8px rgba(0,0,0,0.35)'
          : 'inset 0 1px 3px rgba(255,255,255,0.9), inset 0 -3px 4px rgba(30, 41, 59, 0.45), 0 4px 8px rgba(0,0,0,0.35)',
      }}
    >
      {/* Inner Inset Metallic Rim */}
      <div
        className="absolute inset-[2.5px] rounded-full pointer-events-none"
        style={{
          border: isRed ? '1px dashed #ef4444' : '1px dashed #475569',
          opacity: 0.85,
        }}
      />

      {/* Traditional Calligraphy Character with 3D Emboss */}
      <span
        className={`font-piece font-black leading-none ${
          isRed ? 'text-red-700' : 'text-slate-900'
        } ${showLabel ? 'text-xl sm:text-2xl mt-[-2px]' : 'text-2xl sm:text-3xl'}`}
        style={{
          textShadow: isRed
            ? '0 1px 1px rgba(255, 255, 255, 0.6), 0 -1px 1px rgba(185, 28, 28, 0.3)'
            : '0 1px 1px rgba(255, 255, 255, 0.6), 0 -1px 1px rgba(15, 23, 42, 0.3)',
        }}
      >
        {char}
      </span>

      {/* Vietnamese transliteration label */}
      {showLabel && (
        <span
          className={`text-[8px] sm:text-[9px] font-bold tracking-tight uppercase leading-none mt-0.5 ${
            isRed ? 'text-red-800' : 'text-slate-700'
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
});

PieceView.displayName = 'PieceView';
