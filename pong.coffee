class Entity
  x: 0
  y: 0
  width: 0
  height: 0
  xVelocity: 0
  yVelocity: 0

  update: ->
    @x += @xVelocity
    @y += @yVelocity

  draw: (canvas) ->
    canvas.fillStyle = '#fff'
    canvas.fillRect @x, @y, @width, @height

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

  draw: (canvas) ->
    # Draw black background
    canvas.fillStyle = '#000'
    canvas.fillRect 0, 0, game.width, game.height

    # Print scores
    canvas.fillStyle = '#fff'
    canvas.font = "40px monospace"
    canvas.fillText game.player.score, game.width * 3 / 8, 50
    canvas.fillText game.bot.score, game.width * 5 / 8, 50

game =
  fps: 60

  simpleStart: ->
    @timer = setInterval =>
      @draw()
      @update()
    , 1000 / @fps

  start: ->
    updated = false

    # Update the entities at fixed interval
    @timer = setInterval ->
      game.update()
      updated = true
    , 1000 / @fps

    # Draw only when required
    requestAnimationFrame ->
      if game.running()
        # Draw when game is running and has been updated
        if updated
          game.draw()
          updated = false

        requestAnimationFrame(arguments.callee)

  update: ->
    entity.update() for entity in @entities

  draw: ->
    entity.draw @canvas for entity in @entities

  running: ->
    @timer?

  stop: ->
    clearInterval @timer
    @timer = null

    @canvas.font = "100px monospace"
    @canvas.fillText "Paused", game.width / 2 - 170, 170

  init: ($canvas) ->
    el = $canvas[0]
    @canvas = el.getContext("2d")
    @width = el.width
    @height = el.height

    @entities = [
      new Background()
      @player = new Player()
      @bot = new Bot()
      @ball = new Ball()
    ]

    @draw()
    @stop()

    $canvas
      .focus (e) ->
        game.start()
      .blur (e) ->
        game.stop()
      .keydown (e) ->
        # Cancel bubbling of arrow keys
        e.preventDefault() if game.running() and e.which in [37..40] # arrow keys
        toggleKey e, true
      .keyup (e) ->
        toggleKey e, false

    toggleKey = (e, pressed) ->
      switch e.which
        when 38 then game.upKey = pressed
        when 40 then game.downKey = pressed

$ -> game.init $("canvas")
