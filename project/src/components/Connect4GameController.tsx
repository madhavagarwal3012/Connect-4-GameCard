import React, { useState } from 'react';

interface Move {
  moveNumber: number;
  column: number;
  row: number;
  color: string;
  githubUsername: string;
}

interface GameState {
  board: (number | null)[][];
  players: { username: string; color: string }[];
  moveHistory: Move[];
  currentPlayer: number;
  winner: string | null;
}

export const Connect4GameController: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(6).fill(null).map(() => Array(7).fill(null)),
    players: [
      { username: "player1", color: "#FFD700" },
      { username: "player2", color: "#FF4136" }
    ],
    moveHistory: [],
    currentPlayer: 0,
    winner: null
  });

  const [newMove, setNewMove] = useState({
    column: 0,
    githubUsername: "player1"
  });

  const makeMove = async () => {
    try {
      // Find the lowest empty row in the selected column
      let row = -1;
      for (let r = 5; r >= 0; r--) {
        if (gameState.board[r][newMove.column] === null) {
          row = r;
          break;
        }
      }

      if (row === -1) {
        alert("Column is full! Choose another column.");
        return;
      }

      // Create new move
      const move: Move = {
        moveNumber: gameState.moveHistory.length + 1,
        column: newMove.column,
        row: row,
        color: gameState.players[gameState.currentPlayer].color,
        githubUsername: newMove.githubUsername
      };

      // Update board
      const newBoard = gameState.board.map(row => [...row]);
      newBoard[row][newMove.column] = gameState.currentPlayer;

      // Update game state
      const newGameState: GameState = {
        ...gameState,
        board: newBoard,
        moveHistory: [...gameState.moveHistory, move],
        currentPlayer: (gameState.currentPlayer + 1) % 2
      };

      // Save to file (this would normally be an API call)
      const response = await fetch('/api/update-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGameState)
      });

      if (response.ok) {
        setGameState(newGameState);
        // Refresh the SVG card
        window.location.reload();
      } else {
        alert("Failed to save move. Please try again.");
      }
    } catch (error) {
      console.error("Error making move:", error);
      alert("Error making move. Please try again.");
    }
  };

  const resetGame = () => {
    const resetState: GameState = {
      board: Array(6).fill(null).map(() => Array(7).fill(null)),
      players: gameState.players,
      moveHistory: [],
      currentPlayer: 0,
      winner: null
    };
    setGameState(resetState);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4">Make a Move</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Column (0-6):
          </label>
          <input
            type="number"
            min="0"
            max="6"
            value={newMove.column}
            onChange={(e) => setNewMove({...newMove, column: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Username:
          </label>
          <input
            type="text"
            value={newMove.githubUsername}
            onChange={(e) => setNewMove({...newMove, githubUsername: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={makeMove}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Make Move
          </button>
          <button
            onClick={resetGame}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Reset Game
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p>Current Player: {gameState.players[gameState.currentPlayer].username}</p>
          <p>Color: <span style={{color: gameState.players[gameState.currentPlayer].color}}>●</span></p>
          <p>Total Moves: {gameState.moveHistory.length}</p>
        </div>
      </div>
    </div>
  );
}; 