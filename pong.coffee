class Entity
  x: 0
  y: 0
  width: 0
  height: 0
  xVelocity: 0
  yVelocity: 0

  update: (percentage = 1) ->
    @x += @xVelocity * percentage
    @y += @yVelocity * percentage

  draw: (context) ->
    context.fillStyle = '#fff'
    context.fillRect @x, @y, @width, @height

  centerVertically: ->
    @y = game.height / 2 - @height / 2

  centerHorizontally: ->
    @x = game.width / 2 - @width / 2

  center: ->
    @centerHorizontally()
    @centerVertically()

  intersect: (other) ->
    @y + @height > other.y and
    @y < other.y + other.height and
    @x + @width > other.x and
    @x < other.x + other.width

class Paddle extends Entity
  width: 20
  height: 100

  score: 0

  constructor: ->
    @centerVertically()

  update: ->
    super

    # Keep paddle inside the screen limits
    @y = Math.min(Math.max(@y, 0), game.height - @height)

class Player extends Paddle
  x: 20
  speed: 15

  update: ->
    if game.upKey
      @yVelocity = -@speed
    else if game.downKey
      @yVelocity = @speed
    else
      @yVelocity = 0

    super

class Bot extends Paddle
  speed: 5

  constructor: ->
    super
    @x = game.width - @width - 20

  update: ->
    # Follow the ball
    if @y < game.ball.y
      @yVelocity = @speed
    else
      @yVelocity = -@speed

    super

class Ball extends Entity
  width: 20
  height: 20

  launchSpeed: 7
  minLaunchAngle: -30
  maxLaunchAngle: 30

  constructor: ->
    @reset()
    @blip = new Audio()
    @blip.src = if @blip.canPlayType('audio/mpeg') then "blip.mp3" else @blip.src = "blip.ogg"

  reset: ->
    @center()

    # Launch ball at random angle between our min and max angles
    angle = Math.floor(Math.random() * (@maxLaunchAngle - @minLaunchAngle + 1)) + @minLaunchAngle

    # Convert angle to x,y coordinates
    radian = Math.PI / 180
    @xVelocity = @launchSpeed * Math.cos(angle * radian)
    @yVelocity = @launchSpeed * Math.sin(angle * radian)

    # Alternate between going right and left
    @xVelocity *= -1 if Math.random() > 0.5

  update: ->
    super

    # Detects if and which paddle we hit
    if @intersect(game.player)
      hitter = game.player
    else if @intersect(game.bot)
      hitter = game.bot

    # Hits a paddle.
    if hitter
      @xVelocity *= -1.1 # Rebound and increase speed
      @yVelocity *= 1.1

      # Transfer some of the paddle velocity to the ball
      @yVelocity += hitter.yVelocity / 4

      @blip.play()

    # Hits top or bottom wall. Rebound!
    if @y < 0 or @y > game.height - @height
      @yVelocity *= -1
      @blip.play()

    # Off screen on left. Bot wins.
    if @x < 0
      game.bot.score += 1
      @reset()

    # Off screen on right. Player wins.
    if @x > game.width
      game.player.score += 1
      @reset()

class Background
  update: ->

  draw: (context) ->
    # Draw black background
    context.fillStyle = '#000'
    context.fillRect 0, 0, game.width, game.height

    # Print scores
    context.fillStyle = '#fff'
    context.font = "40px monospace"
    context.fillText game.player.score, game.width * 3 / 8, 50
    context.fillText game.bot.score, game.width * 5 / 8, 50

game =
  fps: 60

  # ## Simple game loop.
  #
  # We update and draw at fixed intervals using a JavaScript timer.
  simpleStart: ->
    @timer = setInterval =>
      @update()
      @draw()
    , 1000 / @fps

  # ## A better game loop
  #
  # The problem with the previous loop is that we might be updating too often,
  # consuming too much CPU or not enough, causing jitters in animations.
  #
  # We need to sync with the video card and monitor refresh rate. Thankfully,
  # JavaScript recently gifted us with `requestAnimationFrame`. It receives a
  # callback, call at proper interval to sync with your display refresh rate.
  start: ->
    @lastUpdateTime = new Date().getTime()
    
    onFrame = =>
      # Update and draw
      @fixedTimeStep()
      # @variableTimeStep()

      # Schedule the next update
      @requestId = requestAnimationFrame onFrame

    onFrame()

  fixedTimeStep: ->
    currentTime = new Date().getTime()
    interval = 1000 / @fps # ms per frame
    updated = false

    while @lastUpdateTime < currentTime
      @update()
      updated = true
      @lastUpdateTime += interval

    @draw() if updated
  
  variableTimeStep: ->
    currentTime = new Date().getTime()
    interval = 1000 / @fps # ms per frame

    timeDelta = currentTime - @lastUpdateTime
    percentageOfInterval = timeDelta / interval
    @update percentageOfInterval
    @draw()

    @lastUpdateTime = new Date().getTime()

  update: ->
    entity.update(arguments...) for entity in @entities

  draw: ->
    entity.draw @context for entity in @entities

  running: ->
    @timer or @requestId

  stop: ->
    clearInterval @timer
    @timer = null
    cancelAnimationFrame @requestId if @requestId
    @requestId = null

    @context.font = "100px monospace"
    @context.fillText "Paused", game.width / 2 - 170, 170

  init: (canvas) ->
    @context = canvas.getContext("2d")
    @width = canvas.width
    @height = canvas.height

    @entities = [
      new Background()
      @player = new Player()
      @bot = new Bot()
      @ball = new Ball()
    ]

    @draw()
    @stop()

    $(canvas)
      .focus (e) ->
        game.start()
      .blur (e) ->
        game.stop()
      .keydown (e) ->
        # Prevent default behavior of arrow keys
        e.preventDefault() if game.running() and e.which in [37..40] # arrow keys
        toggleKey e, true
      .keyup (e) ->
        toggleKey e, false

    toggleKey = (e, pressed) ->
      switch e.which
        when 38 then game.upKey = pressed
        when 40 then game.downKey = pressed

$ -> game.init $('canvas#pong')[0]
