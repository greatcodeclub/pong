class Entity
  x: 0
  y: 0
  width: 0
  height: 0

  centerVertically: ->
    @y = game.height / 2 - @height / 2

  centerHorizontally: ->
    @x = game.width / 2 - @width / 2

  center: ->
    @centerHorizontally()
    @centerVertically()

  update: ->

  draw: (canvas) ->
    canvas.fillStyle = '#fff'
    canvas.fillRect @x, @y, @width, @height

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
    # Keep paddle inside the screen limits
    @y = Math.min(Math.max(@y, 0), game.height - @height)

class Player extends Paddle
  x: 20
  speed: 15

  update: ->
    if game.upKey
      @y -= @speed
    else if game.downKey
      @y += @speed

    super

class Bot extends Paddle
  speed: 5

  constructor: ->
    super
    @x = game.width - @width - 20

  update: ->
    # Follow the ball
    @y += @speed if @y < game.ball.y
    @y -= @speed if @y > game.ball.y

    super

class Ball extends Entity
  width: 20
  height: 20

  constructor: ->
    @reset()
    @blip = new Audio()
    @blip.src = if @blip.canPlayType('audio/mpeg') then "blip.mp3" else @blip.src = "blip.ogg"

  reset: ->
    @center()

    # Launch ball at random angle between -30 & 30 deg
    minAngle = -30
    maxAngle = 30
    angle = Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle

    # Convert angle to x,y coordinates
    radian = Math.PI / 180
    speed = 7
    @xVelocity = speed * Math.cos(angle * radian)
    @yVelocity = speed * Math.sin(angle * radian)

    # Alternate between going right and left
    @xVelocity *= -1 if Math.random() > 0.5

  update: ->
    @x += @xVelocity
    @y += @yVelocity

    # Hits a paddle. Rebound and increase speed
    if @intersect(game.player) or @intersect(game.bot)
      @xVelocity *= -1.1
      @yVelocity *= 1.1
      @blip.play()

    # FIXME required?
    if @intersect(game.player)
      @x = game.player.x + game.player.width
    if @intersect(game.bot)
      @x = game.bot.x - @width

    # Hits top or bottom. Rebound!
    if @y < 0 or @y > game.height - @height
      @yVelocity *= -1
      @blip.play()

    if @x < 0 # Off screen on left. Bot wins.
      game.bot.score += 1
      @reset()

    if @x > game.width # Off score on right. Player wins.
      game.player.score += 1
      @reset()

game =
  start: ->
    fps = 60
    @timer = setInterval =>
      @run()
    , 1000 / fps

  run: ->
    # Draw black background
    @canvas.fillStyle = '#000'
    @canvas.fillRect 0, 0, @width, @height

    # Update and draw each entity
    @entities.forEach (entity) -> entity.update()
    @entities.forEach (entity) => entity.draw(@canvas)

    # Print scores
    @canvas.font = "40px monospace"
    @canvas.fillText @player.score, game.width * 3 / 8, 50
    @canvas.fillText @bot.score, game.width * 5 / 8, 50

  running: ->
    @timer?

  stop: ->
    clearInterval @timer
    @timer = null

    @canvas.font = "100px monospace"
    @canvas.fillText "Paused", game.width / 2 - 170, 170

  create: ->
    @entities = []

    @entities.push @player = new Player()
    @entities.push @bot = new Bot()
    @entities.push @ball = new Ball()

  init: ->
    $canvas = $("canvas")
    el = $canvas[0]
    @canvas = el.getContext("2d")
    @width = el.width
    @height = el.height

    @create()

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

    @run()
    @stop()

$ -> game.init()
