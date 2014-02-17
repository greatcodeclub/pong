Game.systems = {
  // Apply velocity to a position
  velocity: {
    update: function(entity) {
      entity.position.x += entity.velocity.x
      entity.position.y += entity.velocity.y
    }
  },

  // Center an entity on screen
  center: {
    init: function(entity) {
      if (entity.center === true || entity.center === 'horizontally')
        entity.position.x = game.width / 2 - entity.dimensions.width / 2
      if (entity.center === true || entity.center === 'vertically')
        entity.position.y = game.height / 2 - entity.dimensions.height / 2
    }
  },

  // Rebound on up and down walls
  reboundOnWalls: {
    update: function(entity) {
      if (entity.position.y < 0 || entity.position.y + entity.dimensions.height > game.height) {
        entity.velocity.y *= -1
      }
    }
  },

  // Rebound on player and bot paddles
  reboundOnPaddles: {
    update: function(entity) {
      // Detects if and which paddle we hit
      if (intersect(entity, game.player)) {
        var hitter = game.player
      } else if (intersect(entity, game.bot)) {
        var hitter = game.bot
      }

      // Hits a paddle.
      if (hitter) {
        entity.velocity.x *= -1.1 // Rebound and increase speed
        entity.velocity.y *= 1.1

        // Transfer some of the paddle vertical velocity to the ball
        entity.velocity.y += hitter.velocity.y / 4
      }
    }
  },

  // Keep the entity within screen limits vertically.
  keepInScreen: {
    update: function(entity) {
      entity.position.y = Math.min(Math.max(entity.position.y, 0),
                                   game.height - entity.dimensions.height)
    }
  },

  // Hook the entity vertical velocity to the keyboard up & down arrows.
  keyboardControlled: {
    update: function(entity) {
      var speed = entity.keyboardControlled.speed

      if (game.keyPressed.up) {
        entity.velocity.y = -speed
      } else if (game.keyPressed.down) {
        entity.velocity.y = speed
      } else {
        entity.velocity.y = 0
      }
    }
  },

  // Make the entity follow the ball vertical position.
  followBall: {
    update: function(entity) {
      var speed = entity.followBall.speed

      if (entity.position.y < game.ball.position.y) {
        entity.velocity.y = speed
      } else {
        entity.velocity.y = -speed
      }
    }
  },

  // Start the entity at random velocity.
  randomVelocity: {
    init: function(entity) {
      var minAngle = entity.randomVelocity.minAngle,
          maxAngle = entity.randomVelocity.maxAngle,
          angle = Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle
      // Convert angle to x,y coordinates
      var radian = Math.PI / 180,
          speed = entity.randomVelocity.speed
      entity.velocity = {
        x: speed * Math.cos(angle * radian),
        y: speed * Math.sin(angle * radian)
      }

      if (Math.random() > 0.5) entity.velocity.x *= -1
    }
  },

  // Increment score when the entity goes off screen.
  scores: {
    update: function(entity) {
      // Off screen on left. Bot wins.
      if (entity.position.x < -entity.dimensions.width) {
        game.bot.score += 1
        game.reset()
      }

      // Off screen on right. Player wins.
      if (entity.position.x > game.width) {
        game.player.score += 1
        game.reset()
      }
    }
  },

  //// Drawing systems

  // Draw the entity as a rectangle
  drawAsRectangle: {
    draw: function(entity) {
      game.context.fillStyle = entity.color
      game.context.fillRect(entity.position.x, entity.position.y,
                            entity.dimensions.width, entity.dimensions.height)
    }
  },

  // Draw the `score` property of the entity.
  drawScore: {
    draw: function(entity) {
      game.context.fillStyle = entity.color
      game.context.font = entity.font
      game.context.fillText(entity.drawScore.score, entity.position.x, entity.position.y)
    }
  }
}

// Run all applicable systems on an entity for a specified action (init, update or draw).
Game.runSystems = function(entity, action) {
  var systemNames = Object.getOwnPropertyNames(Game.systems)

  systemNames.forEach(function(systemName) {
    // Check if the entity has a component handled by the system.
    if (entity[systemName] != null) {
      // If there's a system for that component, we call its action.
      var system = Game.systems[systemName]
      var callback = system[action]
      if (callback) callback(entity)
    }
  })
}


//// Utility functions

function intersect(a, b) {
  return a.position.y + a.dimensions.height > b.position.y &&
         a.position.y                       < b.position.y + b.dimensions.height &&
         a.position.x + a.dimensions.width  > b.position.x &&
         a.position.x                       < b.position.x + b.dimensions.width
}
