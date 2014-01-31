function Ball() {
  Entity.call(this)
  
  this.width = 20
  this.height = 20

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
  this.y = game.height / 2 - this.height / 2

  // A simple way to start in a random direction
  // var max = 5, min = -5
  // this.yVelocity = Math.floor(Math.random() * (max - min + 1) + min)
  // this.xVelocity = 5

  // A better way to launch the ball at a random angle
  var minAngle = -30,
      maxAngle = 30,
      angle = Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle
  // Convert angle to x,y coordinates
  var radian = Math.PI / 180,
      speed = 7
  this.xVelocity = speed * Math.cos(angle * radian)
  this.yVelocity = speed * Math.sin(angle * radian)

  // Alternate between right and left
  if (Math.random() > 0.5) this.xVelocity *= -1
}

Ball.prototype.update = function() {
  Entity.prototype.update.apply(this, arguments)

  // Detects if and which paddle we hit
  if (this.intersect(game.player)) {
    var hitter = game.player
  } else if (this.intersect(game.bot)) {
    var hitter = game.bot
  }

  // Hits a paddle.
  if (hitter) {
    this.xVelocity *= -1.1 // Rebound and increase speed
    this.yVelocity *= 1.1

    // Transfer some of the paddle vertical velocity to the ball
    this.yVelocity += hitter.yVelocity / 4

    this.blip.play()
  }

  // Rebound if it hits top or bottom
  if (this.y < 0 || this.y + this.height > game.height) {
    this.yVelocity *= -1 // rebound, switch direction
    this.blip.play()
  }

  // Off screen on left. Bot wins.
  if (this.x < -this.width) {
    game.bot.score += 1
    this.reset()
  }

  // Off screen on right. Player wins.
  if (this.x > game.width) {
    game.player.score += 1
    this.reset()
  }
}