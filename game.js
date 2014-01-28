var KEY_UP = 38,
    KEY_DOWN = 40

var game = {
  // Initialize the game and hook it to the Canvas
  init: function(canvas) {
    var self = this

    this.context = canvas.getContext("2d")
    this.width = canvas.width
    this.height = canvas.height

    // Key track of pressed keys
    this.keyPressed = {} // { keyCode: true if key is down, false if up }

    $(canvas).on('keydown keyup', function(e) {
      // We only keep track of UP and DOWN arrow keys
      if (e.which === KEY_UP || e.which === KEY_DOWN) {
        self.keyPressed[e.which] = e.type === 'keydown'
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
  simpleStart: function() {
    var self = this,
        fps = 60,
        interval = 1000 / fps // ms per frame

    setInterval(function() {
      self.update()
      self.draw()
    }, interval)
  },

  // A better game loop for languages with timers
  start: function() {
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

  start: function() {
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

    this.update(percentageOfInterval)
    this.draw()

    this.lastUpdateTime = new Date().getTime()
  }
}
