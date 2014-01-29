# HTML5 Canvas 2D Game

The first project of [The Great Code Club](http://www.greatcodeclub.com/).

### Sample project: Pong

...

### Setting up your dev environment

You can opened up `game.html` directly in your browser using the `file://` protocol. However, I recommend you start a real web server. If you have python installed:

    $ python -m SimpleHTTPServer

Then browse to http://localhost:8000/game.html.

Reload the page each time you change something, or check out `Guardfile` to setup automatic reloading.

### Creating Your Own

This project includes the following files you can re-use to make your own custom game:

- `game.js` is the generic game engine.
- `entity.js` the base class for any game entities.

Refer to `pong.js` to initialize the game and load the entities.

### Resources

- [A simple racing game in CoffeeScript I made](http://macournoyer.com/game/)
- [A small platform game re-implemented in several languages](https://github.com/alejolp/grounded)
- [So many JavaScript game engines ...](http://html5gameengine.com/)
- [LOVE - game engine for Lua](https://love2d.org/)
- [Other collision detection algorithms](http://devmag.org.za/2009/04/13/basic-collision-detection-in-2d-part-1/)
- [Article about JavaScript game loops](http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html)
- [More about fixed time steps game loops](http://www.flipcode.com/archives/Main_Loop_with_Fixed_Time_Steps.shtml)

#### Game Assets

- http://kenney.nl/assets
- http://www.reddit.com/r/gameassets
- http://opengameart.org/

### License

Copyright 2014 Coded Inc.
marc@codedinc.com

You are free to modify and distribute this however you want. Expect for teaching purposes.
