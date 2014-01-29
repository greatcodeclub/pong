function Paddle() {
  Entity.call(this)

  this.width = 20
  this.height = 100

  this.x = 20
  this.y = game.height / 2 - this.height / 2

  this.speed = 15

  this.score = 0
}

Paddle.prototype = Object.create(Entity.prototype)

Paddle.prototype.advance = function() {
  // Call super method
  Entity.prototype.advance.apply(this, arguments)

  // Keep the paddle within the screen
  this.y = Math.min(Math.max(this.y, 0),
                    game.height - this.height)
}


function Player() {
  Paddle.call(this)
}

Player.prototype = Object.create(Paddle.prototype)

Player.prototype.update = function() {
  if (game.keyPressed.up) {
    this.yVelocity = -this.speed
  } else if (game.keyPressed.down) {
    this.yVelocity = this.speed
  } else {
    this.yVelocity = 0
  }

  this.advance()
}

function Bot() {
  Paddle.call(this)
  this.speed = 5
  this.x = game.width - this.width - 20
}

Bot.prototype = Object.create(Paddle.prototype)

Bot.prototype.update = function() {
  // Follow the ball
  if (this.y < game.ball.y) {
    this.yVelocity = this.speed
  } else {
    this.yVelocity = -this.speed
  }

  this.advance()
}

