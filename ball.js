function Ball() {
  Entity.call(this)
  
  this.width = 20
  this.height = 20

  this.gravity = 9.81 // Newton would be proud.

  this.reset()

  // Load sound
  this.blip = new Audio()
  if (this.blip.canPlayType('audio/mpeg')) {
    this.blip.src = 'blip.mp3'
  } else {
    this.blip.src = 'blip.ogg'
  }
}

Ball.prototype = Object.create(Entity.prototype)
Ball.prototype.constructor = Ball

// Reset the ball's position
Ball.prototype.reset = function() {
  this.x = game.width / 2 - this.width / 2
  this.y = game.height - this.height * 2

  // A simple way to start in a random direction
  // var max = 5, min = -5
  // this.yVelocity = Math.floor(Math.random() * (max - min + 1) + min)
  // this.xVelocity = 5

  // A better way to launch the ball at a random angle
  var minAngle = 240,
      maxAngle = 300,
      angle = Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle
  // Convert angle to x,y coordinates
  var radian = Math.PI / 180,
      speed = 7
  this.xVelocity = speed * Math.cos(angle * radian)
  this.yVelocity = speed * Math.sin(angle * radian)
}

Ball.prototype.update = function(percentage) {
  Entity.prototype.update.apply(this, arguments)

  if(game.turn == "player") {
    this.col = game.player.col
  }
  else {
    this.col = game.bot.col
  }
  
  // Apply gravitational pull downwards.
  this.yVelocity += (this.gravity / 100) * percentage

  // Detects if and which paddle we hit
  if (this.intersect(game.player) && game.turn == "player") {
    var hitter = game.player
    game.turn = "bot"
  } else if (this.intersect(game.bot) && game.turn == "bot") {
    var hitter = game.bot
    game.turn = "player"
  }

  // Hits a paddle.
  if (hitter) {
    this.yVelocity *= -1.1 // Rebound and increase speed

    // Transfer some of the paddle horizontal velocity to the ball
    this.xVelocity += hitter.xVelocity / 4

    this.blip.play()
  }

  // Rebound if it hits top or bottom
  if (this.y < 0) {
    this.y = 0
    this.yVelocity *= -1 // rebound, switch direction
    this.blip.play()
  } 
  if (this.y + this.height > game.height) {
    this.y = game.height - this.height
    this.yVelocity *= -1 // rebound, switch direction
    this.blip.play()
  }


  // Rebound if it hits left or right
  if (this.x < 02 || this.x > (game.width - this.width)) {
    this.xVelocity *= -0.9 // dampen the bounce on the walls
  }

}