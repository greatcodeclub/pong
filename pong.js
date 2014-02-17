var game = new Game($('canvas')[0])

// Load the game entities
game.entities = [
  
  // Background
  {
    position: { x: 0, y: 0 },
    dimensions: { width: game.width, height: game.height },
    color: '#000',
    drawAsRectangle: true
  },

  game.ball = {
    position: { x: 0, y: 0 },
    center: true,
    dimensions: { width: 20, height: 20 },
    randomVelocity: { minAngle: -30, maxAngle: 30, speed: 7 },
    reboundOnWalls: true,
    reboundOnPaddles: true,
    scores: true,
    color: '#fff',
    drawAsRectangle: true
  },

  game.player = {
    position: { x: 20 },
    center: 'vertically',
    dimensions: { width: 20, height: 100 },
    velocity: { x: 0, y: 0 },
    keepInScreen: true,
    keyboardControlled: { speed: 15 },
    score: 0,
    color: '#fff',
    drawAsRectangle: true
  },

  game.bot = {
    position: { x: game.width - 40 },
    center: 'vertically',
    dimensions: { width: 20, height: 100 },
    velocity: { x: 0, y: 0 },
    keepInScreen: true,
    followBall: { speed: 5 },
    score: 0,
    color: '#fff',
    drawAsRectangle: true
  },

  // Player score
  {
    position: { x: game.width * 3 / 8, y: 50 },
    color: '#fff',
    font: '40px monospace',
    drawScore: game.player
  },

  // Bot score
  {
    position: { x: game.width * 5 / 8, y: 50 },
    color: '#fff',
    font: '40px monospace',
    drawScore: game.bot
  }

]

game.start()
$('canvas')[0].focus()
