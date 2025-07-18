export interface Move {
  moveNumber: number;
  column: number;
  row: number;
  color: string;
  githubUsername: string;
}

export interface GameState {
  board: (number | null)[][];
  players: { username: string; color: string }[];
  moveHistory: Move[];
  currentPlayer: number;
  winner: string | null;
}