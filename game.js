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

// A simple (but inaccurate) game loop
//
//   Game.prototype.start = function() {
//     var self = this,
//         fps = 60,
//         interval = 1000 / fps // ms per frame
//   
//     setInterval(function() {
//       self.update()
//       self.draw()
//     }, interval)
//   }

// A better game loop. Similar to the ones you'll find in most games.
Game.prototype.start = function() {
  var self = this

  this.lastUpdateTime = new Date().getTime()
  
  onFrame(function() {
    // Two modes:
    self.fixedTimeStep()
    // or
    // self.variableTimeStep()
  })
}

// Calls the `callback` function when we should draw a new frame.
// Similar to our timer, but this will use the correct FPS to sync with the
// screen refresh rate.
// More info at:
// https://developer.mozilla.org/en/docs/Web/API/window.requestAnimationFrame
var onFrame = function(callback) {
  requestAnimationFrame(function() {
    callback()
    // requestAnimationFrame only calls once, we need to schedule the next
    // call ourself.
    onFrame(callback)
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
    // We jump at fixed intervals until we catch up to the current time.
    this.lastUpdateTime += interval
  }

  // No need to draw if nothing was updated, right?
  if (updated) this.draw()
  updated = false
}

Game.prototype.variableTimeStep = function() {
  var currentTime = new Date().getTime(),
      fps = 60,
      interval = 1000 / fps,
      timeDelta = currentTime - this.lastUpdateTime,
      percentageOfInterval = timeDelta / interval

  // NOTE: This requires changing the update function
  // to support partial updating.
  //
  // Eg.:
  //
  //   Entity.prototype.update = function(percentage) {
  //     this.x += this.xVelocity * percentage
  //     this.y += this.yVelocity * percentage
  //   }
  //
  this.update(percentageOfInterval)
  this.draw()

  this.lastUpdateTime = new Date().getTime()
}
