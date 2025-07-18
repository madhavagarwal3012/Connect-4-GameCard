const CELL_SIZE = 50;
const ROWS = 6;
const COLS = 7;
const PADDING = 20;

// Generate a unique color for each username (simple hash)
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

function renderSVG(state, username) {
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

  // Username display
  let userSVG = `<text x="${width / 2}" y="35" font-size="20" font-family="monospace" fill="${stringToColor(username)}" text-anchor="middle">User: ${username}</text>`;

  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f8f9fa" rx="20"/>
  ${userSVG}
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

export default (req, res) => {
  try {
    const { username = "player1" } = req.query;

    // You can make the board/moves unique per user if you want!
    const state = {
      board: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
      ],
      players: [
        { username: "player1", color: "#FFD700" },
        { username: "player2", color: "#FF4136" }
      ],
      moveHistory: [
        { moveNumber: 1, column: 3, row: 5, color: "#FFD700", githubUsername: "player1" },
        { moveNumber: 2, column: 4, row: 5, color: "#FF4136", githubUsername: "player2" },
        { moveNumber: 3, column: 3, row: 4, color: "#FFD700", githubUsername: "player1" }
      ],
      currentPlayer: 0,
      winner: null
    };

    const svg = renderSVG(state, username);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error generating SVG');
  }
};
