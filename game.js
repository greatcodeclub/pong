var game = {
  // Some key codes to name mapping
  keys: {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  },

  // Initialize the game and hook it to the Canvas
  init: function(canvas) {
    var self = this

    this.context = canvas.getContext("2d")
    this.width = canvas.width
    this.height = canvas.height

    // Key track of pressed keys
    this.keyPressed = {
      // up: (true if pressed)
    }

    $(canvas).on('keydown keyup', function(e) {
      // Convert key code to key name
      var keyName = self.keys[e.which]

      if (keyName) {
        self.keyPressed[keyName] = e.type === 'keydown'
        e.preventDefault()
      }
    })
  },

  update: function() {
    this.entities.forEach(function(entity) {
      if (entity.update) entity.update()
    })
  },

  draw: function() {
    var self = this

    this.entities.forEach(function(entity) {
      if (entity.draw) entity.draw(self.context)
    })
  },

  // Start the game loop
  start: function() {
    var self = this,
        fps = 60,
        interval = 1000 / fps // ms per frame

    setInterval(function() {
      self.update()
      self.draw()
    }, interval)
  },

  // A better game loop for languages with timers
  betterStart: function() {
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
      // Schedule the next update
      requestAnimationFrame(onFrame)
    }
    onFrame()
  },

  classicStart: function() {
    var self = this

    this.lastUpdateTime = new Date().getTime()
    
    var onFrame = function() {
      self.fixedTimeStep()
      // self.variableTimeStep()

      // Schedule the next update
      requestAnimationFrame(onFrame)
    }
    onFrame()
  },

  fixedTimeStep: function() {
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
  },
  
  variableTimeStep: function() {
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
}
