function Game(canvas) {
  var self = this

  this.context = canvas.getContext("2d")
  this.width = canvas.width
  this.height = canvas.height

  // Keep track of key states
  // Eg.:
  //   game.keyPressed.up === true  // while UP key is pressed)
  //   game.keyPressed.up === false // when UP key is released)
  this.keyPressed = {}

  $(canvas).on('keydown keyup', function(e) {
    // Convert key code to key name
    var keyName = Game.keys[e.which]

    if (keyName) {
      // eg.: `self.keyPressed.up = true` on keydown
      // Will be set to `false` on keyup
      self.keyPressed[keyName] = e.type === 'keydown'
      e.preventDefault()
    }
  })
}

// Some key code to key name mappings
Game.keys = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}

Game.prototype.update = function() {
  this.entities.forEach(function(entity) {
    if (entity.update) entity.update()
  })
}

Game.prototype.draw = function() {
  var self = this

  this.entities.forEach(function(entity) {
    if (entity.draw) entity.draw(self.context)
  })
}

// Start the game loop
Game.prototype.start = function() {
  var self = this,
      fps = 60,
      interval = 1000 / fps // ms per frame

  setInterval(function() {
    self.update()
    self.draw()
  }, interval)
}


// Other game loop alternatives
// ----------------------------

// Calls the callback function when the browser requests it, making sure
// it's in sync with the screen refresh rate.
// More info at https://developer.mozilla.org/en/docs/Web/API/window.requestAnimationFrame
var onFrame = function(callback) {
  requestAnimationFrame(function() {
    callback()
    // Schedule the next call
    onFrame(callback)
  })
}

// A better JavaScript game loop updating at fixed interval and drawing
// only when browser requests it.
Game.prototype.betterStart = function() {
  var self = this,
      fps = 60,
      interval = 1000 / fps,
      updated = false

  setInterval(function() {
    self.update()
    updated = true
  }, interval)

  onFrame(function() {
    if (updated) self.draw()
    updated = false
  })
}

// Classic game loops you'll find in most games
Game.prototype.classicStart = function() {
  var self = this

  this.lastUpdateTime = new Date().getTime()
  
  onFrame(function() {
    self.fixedTimeStep()
    // self.variableTimeStep()
  })
}

Game.prototype.fixedTimeStep = function() {
  var currentTime = new Date().getTime(),
      fps = 60,
      interval = 1000 / fps,
      updated = false

  while (this.lastUpdateTime < currentTime) {
    this.update()
    updated = true
    this.lastUpdateTime += interval
  }

  if (updated) this.draw()
  updated = false
}

Game.prototype.variableTimeStep = function() {
  var currentTime = new Date().getTime(),
      fps = 60,
      interval = 1000 / fps,
      timeDelta = currentTime - this.lastUpdateTime,
      percentageOfInterval = timeDelta / interval

  // NOTE: This requires changing the update function to all your entities
  // to support partial updating.
  //
  // Eg.:
  //
  //   update = function(percentage) {
  //     this.x += this.xVelocity * percentage
  //     this.y += this.yVelocity * percentage
  //   }
  //
  this.update(percentageOfInterval)
  this.draw()

  this.lastUpdateTime = new Date().getTime()
}
