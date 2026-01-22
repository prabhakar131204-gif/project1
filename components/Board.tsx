
import React, { useMemo } from 'react';
import { GameTheme, Player, SnakeOrLadder } from '../types';
import { THEMES, STANDARD_BOARD } from '../constants';

interface BoardProps {
  theme: GameTheme;
  players: Player[];
  activePlayerId: number;
}

const Board: React.FC<BoardProps> = ({ theme, players, activePlayerId }) => {
  const config = THEMES[theme];

  const getCoordinates = (cellNum: number) => {
    const zeroBased = cellNum - 1;
    const row = Math.floor(zeroBased / 10);
    const col = row % 2 === 0 ? zeroBased % 10 : 9 - (zeroBased % 10);
    return { x: col * 10 + 5, y: (9 - row) * 10 + 5 };
  };

  const cells = useMemo(() => {
    const boardRows = [];
    for (let r = 9; r >= 0; r--) {
      const row = [];
      for (let c = 0; c < 10; c++) {
        const cellValue = r % 2 === 0 
          ? (r * 10) + c + 1 
          : (r * 10) + (10 - c);
        row.push(cellValue);
      }
      boardRows.push(row);
    }
    return boardRows.flat();
  }, []);

  return (
    <div className={`relative w-full max-w-[600px] aspect-square rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-[16px] border-slate-950 p-2 overflow-hidden transition-all duration-1000 ${config.boardBg}`}>
      {/* Grid Cells */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {cells.map((cellNum) => (
          <div 
            key={cellNum}
            className={`
              relative border-[0.5px] border-black/10 flex flex-col items-center justify-center
              ${cellNum % 2 === 0 ? config.cellColors[0] : config.cellColors[1]}
            `}
          >
            <span className={`absolute top-1 left-1.5 text-[10px] font-black opacity-30 ${config.fontColor}`}>
              {cellNum}
            </span>
            
            <div className="flex flex-wrap gap-1 justify-center items-center z-20">
              {players.filter(p => p.position === cellNum).map(p => (
                <div 
                  key={p.id}
                  className={`
                    w-5 h-5 md:w-10 md:h-10 rounded-2xl flex items-center justify-center text-sm md:text-2xl
                    shadow-2xl border-2 border-white/50 transition-all duration-700 transform
                    ${p.id === activePlayerId ? 'scale-125 z-40 animate-bounce ring-4 ring-amber-400 ring-offset-2 ring-offset-transparent' : 'scale-100 z-20'}
                  `}
                  style={{ backgroundColor: p.color }}
                >
                  {p.avatar}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SVG Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-2xl" viewBox="0 0 100 100">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ladders - Solid Wooden Look */}
        {STANDARD_BOARD.filter(item => item.type === 'LADDER').map((ladder, idx) => {
          const start = getCoordinates(ladder.start);
          const end = getCoordinates(ladder.end);
          return (
            <g key={`ladder-${idx}`} opacity="0.85">
              <line x1={start.x - 2} y1={start.y} x2={end.x - 2} y2={end.y} stroke={config.ladderColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1={start.x + 2} y1={start.y} x2={end.x + 2} y2={end.y} stroke={config.ladderColor} strokeWidth="2.5" strokeLinecap="round" />
              {[...Array(8)].map((_, i) => {
                const step = (i + 1) / 9;
                const rx = start.x + (end.x - start.x) * step;
                const ry = start.y + (end.y - start.y) * step;
                return (
                  <line key={i} x1={rx - 3} y1={ry} x2={rx + 3} y2={ry} stroke={config.ladderColor} strokeWidth="1.2" strokeLinecap="round" />
                );
              })}
            </g>
          );
        })}

        {/* Improved Snakes - More Animalistic */}
        {STANDARD_BOARD.filter(item => item.type === 'SNAKE').map((snake, idx) => {
          const start = getCoordinates(snake.start); // Head position
          const end = getCoordinates(snake.end);     // Tail position
          
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2;
          const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
          const offset = dist / 4;
          const cp1x = start.x + (midX - start.x) + (start.x > end.x ? offset : -offset);
          const cp1y = start.y + (midY - start.y) / 2;
          const cp2x = midX + (end.x - midX) - (start.x > end.x ? offset : -offset);
          const cp2y = midY + (end.y - midY) / 2;

          return (
            <g key={`snake-${idx}`}>
              {/* Snake Body (Textured Shadow) */}
              <path
                d={`M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`}
                fill="none"
                stroke="black"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.2"
                transform="translate(0.5, 0.5)"
              />
              {/* Outer Glow */}
              <path
                d={`M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`}
                fill="none"
                stroke={config.snakeColor}
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.15"
              />
              {/* Snake Body Main */}
              <path
                d={`M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`}
                fill="none"
                stroke={config.snakeColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              {/* Pattern Overlay */}
              <path
                d={`M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`}
                fill="none"
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="0.8 1.5"
              />
              
              {/* Realistic Snake Head */}
              <g transform={`translate(${start.x}, ${start.y})`}>
                <ellipse cx="0" cy="0" rx="2.5" ry="3" fill={config.snakeColor} />
                {/* Eyes - Slanted */}
                <circle cx="-0.8" cy="-0.8" r="0.6" fill="white" />
                <circle cx="0.8" cy="-0.8" r="0.6" fill="white" />
                <rect x="-0.9" y="-1.1" width="0.2" height="0.6" fill="black" />
                <rect x="0.7" y="-1.1" width="0.2" height="0.6" fill="black" />
                {/* Forked Tongue */}
                <path d="M 0 3 L 0 5 L -1 6.5 M 0 5 L 1 6.5" stroke="#ef4444" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              </g>

              {/* Tapered Tail */}
              <circle cx={end.x} cy={end.y} r="1.2" fill={config.snakeColor} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Board;
