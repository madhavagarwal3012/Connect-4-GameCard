const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Add middleware to parse JSON
app.use(express.json());
const PORT = 3001; // Use a different port to avoid conflict with Vite

const CELL_SIZE = 50;
const ROWS = 6;
const COLS = 7;
const PADDING = 20;

function renderSVG(state) {
  const width = COLS * CELL_SIZE + PADDING * 2;
  const height = ROWS * CELL_SIZE + PADDING * 2 + 120;

  // Board
  let boardSVG = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = PADDING + c * CELL_SIZE + CELL_SIZE / 2;
      const y = PADDING + r * CELL_SIZE + CELL_SIZE / 2;
      const cell = state.board[r][c];
      const color = typeof cell === "number" ? state.players[cell].color : "#eee";
      boardSVG += `<circle cx="${x}" cy="${y}" r="${CELL_SIZE / 2 - 4}" fill="${color}" stroke="#333" stroke-width="2"/>`;
    }
  }

  // Move history
  let movesSVG = `<text x="${PADDING}" y="${height - 100}" font-size="18" font-family="monospace" fill="#222">Moves:</text>`;
  state.moveHistory.slice(-8).forEach((move, i) => {
    movesSVG += `<text x="${PADDING}" y="${height - 75 + i * 20}" font-size="16" font-family="monospace" fill="${move.color}">${move.githubUsername}: col ${move.column + 1}</text>`;
  });

  // Winner
  let winnerSVG = "";
  if (state.winner) {
    winnerSVG = `<text x="${width / 2}" y="${height - 110}" font-size="24" font-family="monospace" fill="#28a745" text-anchor="middle">Winner: ${state.winner}</text>`;
  }

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f8f9fa" rx="20"/>
  <g>
    ${boardSVG}
  </g>
  ${winnerSVG}
  <g>
    ${movesSVG}
  </g>
</svg>
  `;
}

app.get('/api/connect4-card', (req, res) => {
  const statePath = path.join(process.cwd(), 'gameState.json');
  const state = JSON.parse(fs.readFileSync(statePath, "utf-8"));
  const svg = renderSVG(state);
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

app.post('/api/update-game', (req, res) => {
  try {
    const newState = req.body;
    const statePath = path.join(process.cwd(), 'gameState.json');
    fs.writeFileSync(statePath, JSON.stringify(newState, null, 2), 'utf-8');
    res.json({ success: true, message: 'Game state updated' });
  } catch (error) {
    console.error('Error updating game state:', error);
    res.status(500).json({ success: false, message: 'Failed to update game state' });
  }
});

app.listen(PORT, () => {
  console.log(`SVG card server running at http://localhost:${PORT}/api/connect4-card`);
}); 