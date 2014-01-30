function Background() {}

Background.prototype.draw = function(context) {
  context.fillStyle = '#000'
  context.fillRect(0, 0, game.width, game.height)

  // Print scores
  context.fillStyle = '#fff'
  context.font = "40px monospace"
  context.fillText(game.player.score, game.width * 3 / 8, 50)
  context.fillText(game.bot.score,    game.width * 5 / 8, 50)
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
