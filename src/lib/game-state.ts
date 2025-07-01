export type Player = 'X' | 'O';
export type BoardState = (Player | null)[];

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
}

export function createInitialState(): GameState {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
  };
}

export function checkWinner(board: BoardState): Player | 'draw' | null {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const [a, b, c] of winningCombinations) {
    const cell = board[a];
    if (cell && cell === board[b] && cell === board[c]) {
      return cell;
    }
  }

  if (board.every(cell => cell !== null)) {
    return 'draw';
  }

  return null;
}

export function makeMove(state: GameState, position: number): GameState {
  if (state.winner || state.board[position]) {
    return state;
  }

  const newBoard = [...state.board];
  newBoard[position] = state.currentPlayer;

  const winner = checkWinner(newBoard);

  return {
    board: newBoard,
    currentPlayer: winner ? state.currentPlayer : (state.currentPlayer === 'X' ? 'O' : 'X'),
    winner,
  };
}
