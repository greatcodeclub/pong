// The game engine

function Game(canvas) {
  this.context = canvas.getContext("2d")
  this.width = canvas.width
  this.height = canvas.height
}

// Some key codes to key name mapping
Game.keys = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}
