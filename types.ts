
export enum GameTheme {
  CLASSIC = 'CLASSIC',
  JUNGLE = 'JUNGLE',
  SPACE = 'SPACE',
  CYBERPUNK = 'CYBERPUNK'
}

export interface Player {
  id: number;
  name: string;
  position: number;
  color: string;
  avatar: string;
}

export interface SnakeOrLadder {
  start: number;
  end: number;
  type: 'SNAKE' | 'LADDER';
}

export type GameState = 'LOBBY' | 'PLAYING' | 'WINNER';

export interface ThemeConfig {
  name: string;
  bg: string;
  boardBg: string;
  cellColors: [string, string];
  snakeColor: string;
  ladderColor: string;
  fontColor: string;
  accentColor: string;
}
