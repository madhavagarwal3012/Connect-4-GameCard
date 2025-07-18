import { GameConfig, Connect4State } from '../types/Game';

export const generateConnect4SVG = (gameState: Connect4State, config: GameConfig): string => {
  const width = 400;
  const height = 500;
  const boardWidth = 350;
  const boardHeight = 300;
  const cellSize = 45;
  const ballRadius = 18;
  const boardX = (width - boardWidth) / 2;
  const boardY = 80;

  // Generate gradient definitions for ball styles
  const generateGradients = () => {
    if (config.ballStyle === 'gradient') {
      return `
        <defs>
          <radialGradient id="player1Gradient" cx="30%" cy="30%">
            <stop offset="0%" style="stop-color:${config.playerColors.player1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${config.playerColors.player1}dd;stop-opacity:1" />
          </radialGradient>
          <radialGradient id="player2Gradient" cx="30%" cy="30%">
            <stop offset="0%" style="stop-color:${config.playerColors.player2};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${config.playerColors.player2}dd;stop-opacity:1" />
          </radialGradient>
        </defs>
      `;
    }
    return '<defs></defs>';
  };

  // Generate board cells
  const generateBoard = () => {
    let boardSVG = '';
    
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const x = boardX + col * cellSize + cellSize / 2;
        const y = boardY + row * cellSize + cellSize / 2;
        const cell = gameState.board[row][col];
        
        // Board hole
        boardSVG += `<circle cx="${x}" cy="${y}" r="${ballRadius}" fill="${config.theme.background}" stroke="${config.theme.border}" stroke-width="2"/>`;
        
        // Player piece
        if (cell !== 0) {
          const isWinning = gameState.winningCells?.some(([r, c]) => r === row && c === col);
          const playerColor = cell === 1 ? config.playerColors.player1 : config.playerColors.player2;
          
          let fill = playerColor;
          let filter = '';
          
          if (config.ballStyle === 'gradient') {
            fill = cell === 1 ? 'url(#player1Gradient)' : 'url(#player2Gradient)';
          } else if (config.ballStyle === 'glow') {
            filter = `drop-shadow(0 0 8px ${playerColor})`;
          }
          
          if (isWinning) {
            filter = 'drop-shadow(0 0 12px #FFD700)';
          }
          
          boardSVG += `<circle cx="${x}" cy="${y}" r="${ballRadius - 2}" fill="${fill}" ${filter ? `filter="${filter}"` : ''}/>`;
        }
      }
    }
    
    return boardSVG;
  };

  // Generate player info
  const generatePlayerInfo = () => {
    const player1Name = gameState.players.player1 || 'Player 1';
    const player2Name = gameState.players.player2 || 'Player 2';
    const currentPlayerName = gameState.currentPlayer === 1 ? player1Name : player2Name;
    
    let statusText = '';
    if (gameState.winner) {
      const winnerName = gameState.winner === 1 ? player1Name : player2Name;
      statusText = `🏆 ${winnerName} Wins!`;
    } else if (gameState.status === 'draw') {
      statusText = "🤝 It's a Draw!";
    } else if (gameState.status === 'playing') {
      statusText = `${currentPlayerName}'s Turn`;
    } else {
      statusText = 'Waiting for players...';
    }

    return `
      <text x="${width / 2}" y="30" text-anchor="middle" fill="${config.theme.text}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${config.title}</text>
      <text x="${width / 2}" y="50" text-anchor="middle" fill="${config.theme.text}" font-family="Arial, sans-serif" font-size="12">${statusText}</text>
      
      <!-- Player 1 -->
      <circle cx="50" cy="420" r="12" fill="${config.playerColors.player1}"/>
      <text x="70" y="425" fill="${config.theme.text}" font-family="Arial, sans-serif" font-size="12">${player1Name}</text>
      
      <!-- Player 2 -->
      <circle cx="50" cy="445" r="12" fill="${config.playerColors.player2}"/>
      <text x="70" y="450" fill="${config.theme.text}" font-family="Arial, sans-serif" font-size="12">${player2Name}</text>
      
      <!-- Game Info -->
      <text x="${width - 20}" y="425" text-anchor="end" fill="${config.theme.text}" font-family="Arial, sans-serif" font-size="10">Game #${gameState.gameNumber}</text>
      <text x="${width - 20}" y="440" text-anchor="end" fill="${config.theme.text}" font-family="Arial, sans-serif" font-size="10">Moves: ${gameState.moveHistory.length}</text>
      <text x="${width - 20}" y="455" text-anchor="end" fill="${config.theme.text}" font-family="Arial, sans-serif" font-size="10">Click to play!</text>
    `;
  };

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${generateGradients()}
      
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="${config.theme.cardBackground}" rx="12"/>
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="${config.theme.border}" stroke-width="1" rx="8"/>
      
      <!-- Board Background -->
      <rect x="${boardX - 10}" y="${boardY - 10}" width="${boardWidth + 20}" height="${boardHeight + 20}" fill="${config.theme.border}" rx="8"/>
      
      <!-- Game Board -->
      ${generateBoard()}
      
      <!-- Player Info and Status -->
      ${generatePlayerInfo()}
    </svg>
  `;
};

export const generateGameSVG = (gameState: any, config: GameConfig): string => {
  switch (config.type) {
    case 'connect4':
      return generateConnect4SVG(gameState, config);
    default:
      return `<svg width="400" height="200"><text x="200" y="100" text-anchor="middle">Game not supported</text></svg>`;
  }
};