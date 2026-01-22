
import { GameTheme, ThemeConfig, SnakeOrLadder } from './types';

export const THEMES: Record<GameTheme, ThemeConfig> = {
  [GameTheme.CLASSIC]: {
    name: 'Royal Classic',
    bg: 'bg-stone-950',
    boardBg: 'bg-stone-50',
    cellColors: ['bg-amber-50', 'bg-white'],
    snakeColor: '#dc2626',
    ladderColor: '#16a34a',
    fontColor: 'text-stone-900',
    accentColor: 'amber'
  },
  [GameTheme.JUNGLE]: {
    name: 'Ancient Jungle',
    bg: 'bg-emerald-950',
    boardBg: 'bg-emerald-900',
    cellColors: ['bg-emerald-800', 'bg-emerald-700'],
    snakeColor: '#facc15',
    ladderColor: '#d97706',
    fontColor: 'text-emerald-50',
    accentColor: 'emerald'
  },
  [GameTheme.SPACE]: {
    name: 'Star Voyager',
    bg: 'bg-indigo-950',
    boardBg: 'bg-indigo-950',
    cellColors: ['bg-indigo-900', 'bg-slate-900'],
    snakeColor: '#ec4899',
    ladderColor: '#06b6d4',
    fontColor: 'text-indigo-50',
    accentColor: 'indigo'
  },
  [GameTheme.CYBERPUNK]: {
    name: 'Neon District',
    bg: 'bg-black',
    boardBg: 'bg-zinc-900',
    cellColors: ['bg-purple-900/40', 'bg-zinc-900'],
    snakeColor: '#22d3ee',
    ladderColor: '#f472b6',
    fontColor: 'text-fuchsia-400',
    accentColor: 'fuchsia'
  }
};

export const STANDARD_BOARD: SnakeOrLadder[] = [
  // Ladders
  { start: 2, end: 38, type: 'LADDER' },
  { start: 7, end: 14, type: 'LADDER' },
  { start: 8, end: 31, type: 'LADDER' },
  { start: 15, end: 26, type: 'LADDER' },
  { start: 21, end: 42, type: 'LADDER' },
  { start: 28, end: 84, type: 'LADDER' },
  { start: 36, end: 44, type: 'LADDER' },
  { start: 51, end: 67, type: 'LADDER' },
  { start: 71, end: 91, type: 'LADDER' },
  { start: 78, end: 98, type: 'LADDER' },
  { start: 87, end: 94, type: 'LADDER' },
  // Snakes
  { start: 16, end: 6, type: 'SNAKE' },
  { start: 46, end: 25, type: 'SNAKE' },
  { start: 49, end: 11, type: 'SNAKE' },
  { start: 62, end: 19, type: 'SNAKE' },
  { start: 64, end: 60, type: 'SNAKE' },
  { start: 74, end: 53, type: 'SNAKE' },
  { start: 89, end: 68, type: 'SNAKE' },
  { start: 92, end: 88, type: 'SNAKE' },
  { start: 95, end: 75, type: 'SNAKE' },
  { start: 99, end: 80, type: 'SNAKE' },
];

export const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
export const PLAYER_AVATARS = [
  '👑', '🛡️', '⚔️', '🔮', '🏹', '🐉', '🧙', '🧝'
];
