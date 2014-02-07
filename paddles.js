function Paddle() {
  Entity.call(this)

  this.width = 100
  this.height = 20

  this.y = game.height - (this.height * 2)

  this.score = 0
}

Paddle.prototype = Object.create(Entity.prototype)
Paddle.prototype.constructor = Paddle

Paddle.prototype.update = function() {
  Entity.prototype.update.apply(this, arguments)

  // Keep the paddle within the screen
  this.y = Math.min(Math.max(this.y, 0),
                    game.height - this.height)
}


function Player() {
  Paddle.call(this)
  
  this.x = 20

  this.speed = 15
}

Player.prototype = Object.create(Paddle.prototype)
Player.prototype.constructor = Player

Player.prototype.update = function() {
  if (game.keyPressed.up) {
    this.yVelocity = -this.speed
  } else if (game.keyPressed.down) {
    this.yVelocity = this.speed
  } else {
    this.yVelocity = 0
  }

  if (game.turn == "player") {
    this.y = game.height - this.height * 3
  }
  else {
    this.y = game.height - this.height * 2
  }

  Paddle.prototype.update.apply(this, arguments)
}


function Bot() {
  Paddle.call(this)

  this.x = game.width - this.width - 20

  this.speed = 5
}

Bot.prototype = Object.create(Paddle.prototype)
Bot.prototype.constructor = Bot

Bot.prototype.update = function() {
  // Follow the ball
  if (this.x + (this.width / 2) < game.ball.x + (game.ball.width / 2)) {
    this.xVelocity = this.speed
  } else {
    this.xVelocity = -this.speed
  }

  if (game.turn == "bot") {
    this.y = game.height - this.height * 3
  }
  else {
    this.y = game.height - this.height * 2
  }

  Paddle.prototype.update.apply(this, arguments)
}

