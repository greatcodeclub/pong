# Pong: an HTML5 Canvas 2D Game

The first project of [The Great Code Club](http://www.greatcodeclub.com/).

![ZOMGBBQ!! Pong!](https://raw2.github.com/codedinc/pong/master/preview.png)

### Setting up your dev environment

You can open `game.html` directly in your browser using the `file://` protocol. However, I recommend you use a real web server. If you have python installed:

    $ python -m SimpleHTTPServer

Then browse to http://localhost:8000/game.html.

Reload the page each time you change something, or check out `Guardfile` to setup automatic reloading.

### How to browse the code

Here are the files you should take a look at, in logical order:

1. `game.html` is the page containing the `<canvas>` we render the game on.
2. `game.js` is the game engine, mainly the game loop.
3. `pong.js` initializes the game and the entities.
4. `entity.js` contains the base class for all game entities.
5. `ball.js` is the ball entity. Boing!
6. `paddles.js` is the logic for the player and computer controlled paddles.

### Creating Your Own

This project includes the following files you can re-use to make your own custom game:

- `game.js` is the generic game engine.
- `entity.js` the base class for any game entities.

Refer to `pong.js` to initialize the game and load the entities.

Happy coding!

### Resources

- [A simple racing game in CoffeeScript I made](http://macournoyer.com/game/)
- [A small platform game re-implemented in several languages](https://github.com/alejolp/grounded)
- [So many JavaScript game engines ...](http://html5gameengine.com/)
- [Other collision detection algorithms](http://devmag.org.za/2009/04/13/basic-collision-detection-in-2d-part-1/)
- [Article about JavaScript game loops](http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html)
- [More about fixed time steps game loops](http://www.flipcode.com/archives/Main_Loop_with_Fixed_Time_Steps.shtml)

#### Game Assets

How to make an awesome game? Use awesome assets (images)!

- http://kenney.nl/assets
- http://www.reddit.com/r/gameassets
- http://opengameart.org/

### License

Copyright 2014 Coded Inc.  
marc@codedinc.com

You are free to modify and distribute this however you want. Except for teaching purposes.
