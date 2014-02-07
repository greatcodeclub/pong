function Background() {}

Background.prototype.draw = function(context) {
  context.fillStyle = '#000'
  context.fillRect(0, 0, game.width, game.height)

  // Print scores
  context.font = "40px monospace"
  context.fillStyle = game.player.col
  context.fillText("You: " + game.player.score, 25, 50)
  context.fillStyle = game.bot.col
  context.fillText("CPU: " + game.bot.score,    game.width - (25 * 7), 50)
}


// Initialize and start the game

var game = new Game($('canvas')[0])

// Load the game entities
game.entities = [
  new Background(),
  game.ball = new Ball(),
  game.player = new Player(),
  game.bot = new Bot()
]

game.start()
$('canvas')[0].focus()
