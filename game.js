function Game(canvas) {
  var self = this

  this.context = canvas.getContext("2d")
  this.width = canvas.width
  this.height = canvas.height

  // Key track of pressed keys
  this.keyDown = {
    // up: (true while key is down)
  }

  $(canvas).on('keydown keyup', function(e) {
    // Convert key code to key name
    var keyName = Game.keys[e.which]

    if (keyName) {
      // eg.: `self.keyDown.up = true` if UP key is pressed
      // Will be set to `false` when the key is released
      self.keyDown[keyName] = e.type === 'keydown'
      e.preventDefault()
    }
  })
}

// Some key codes to key name mapping
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

// A better game loop for languages with timers
Game.prototype.betterStart = function() {
  var self = this,
      fps = 60,
      interval = 1000 / fps,
      updated = false

  setInterval(function() {
    self.update()
    updated = true
  }, interval)

  var onFrame = function() {
    if (updated) self.draw()
    // Schedule the next update when the browser requests it,
    // making sure it's in sync with the screen refresh rate.
    requestAnimationFrame(onFrame)
  }
  onFrame()
}

// A classic game loop you'll find in most games
Game.prototype.classicStart = function() {
  var self = this

  this.lastUpdateTime = new Date().getTime()
  
  var onFrame = function() {
    self.fixedTimeStep()
    // self.variableTimeStep()

    // Schedule the next update
    requestAnimationFrame(onFrame)
  }
  onFrame()
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
}

Game.prototype.variableTimeStep = function() {
  var currentTime = new Date().getTime(),
      fps = 60,
      interval = 1000 / fps,
      timeDelta = currentTime - this.lastUpdateTime,
      percentageOfInterval = timeDelta / interval

  // FIXME this requires changing the update function to all your entities
  //       to support partial updating.
  this.update(percentageOfInterval)
  this.draw()

  this.lastUpdateTime = new Date().getTime()
}
