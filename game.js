var Game = Game || {};

/**
 * Game Event
 * Including event register
 */
Game.Event = {
  AddListener: function(el, type, fn) {
    el.addEventListener(type, fn);
  },
  RemoveListener: function(el, type, fn) {},
  GetEvent: function(e) {}
};

/**
 * Game Components
 * Including padding, ball, scenes, etc.
 */
Game.Component = {
  Stage: {},
  Paddle: {
    create: function(x, y, w, h, speed, color) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.speed = speed;
      this.color = color || 'black';
      console.log(this.color);
    },
    changeSpeed: function(newSpeed) {
      paddle.speed = newSpeed;
    }
  },
  Ball: {
    create: function(x, y, dx, dy, r, color) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.r = r;
      this.color = color || 'black';
      console.log(this.color);
    },
    move: function() {
      this.x += this.dx;
      this.y += this.dy;
    },
    collisionDetect: function(params) {}
  },
  Brick: {}
};

/**
 * Game Action
 * Including game functionality
 */

Game.Action = {
  canvas: document.getElementById('canvas'),
  ctx: canvas.getContext('2d'),
  paddle: new Game.Component.Paddle.create(0, 0, 30, 30, 'red', 10),
  Init: function() {
    this.ball = Object.create(Game.Component.Ball);
    this.ball.create(50, 50, 5, 5, 10, 'blue');
    this.paddle = Object.create(Game.Component.Paddle);
    this.paddle.create(50, 200, 50, 20, 5, 'red');
  },
  Draw: function() {
    this.ctx.clearRect(0, 0, 400, 400);
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2, true);
    this.ctx.stroke();
    this.ctx.fillRect(
      this.paddle.x,
      this.paddle.y,
      this.paddle.w,
      this.paddle.h
    );
    this.ctx.closePath();
    this.ball.move();
  },
  Start: function() {
    this.Draw();

    this.requestId = requestAnimationFrame(this.Start.bind(this));
  },
  Stop: function() {
    cancelAnimationFrame(this.requestId);
  }
};
Game.Action.Init();

/**
 * App start here
 */
function main() {
  Game.Event.AddListener(document.getElementById('debug'), 'click', () => {
    Game.Action.Stop();
  });
  Game.Event.AddListener(document.getElementById('resume'), 'click', () => {
    Game.Action.Start();
  });
  Game.Event.AddListener(document, 'keydown', e => {
    console.log(e);
  });
  Game.Action.Start();
}

main();
