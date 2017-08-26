/**
 * set as global variable for now
 */
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 5;

var Game = Game || {};
Game.End = function() {
  alert('You Lose');
  window.location.reload();
};
/**
 * Game Event
 * Including event register
 */
Game.Event = {
  actions: [],
  keydowns: [],
  AddListener: function(el, type, fn) {
    el.addEventListener(type, fn);
  },
  RemoveListener: function(el, type, fn) {},

  RegisterAction: function(key, callback) {
    this.actions[key] = callback;
  },
  GetEvent: function(e) {}
};

/**
 * Game Components
 * Including padding, ball, scenes, etc.
 */
Game.Component = {
  Stage: {},
  Paddle: {
    create: function(x = 50, y = 380, w = 50, h = 20, speed = 10, color = 'black') {
      var paddle = Object.create(this);
      paddle.x = x;
      paddle.y = y;
      paddle.w = w;
      paddle.h = h;
      paddle.speed = speed;
      paddle.color = color;
      return paddle;
    },
    changeSpeed: function(newSpeed) {
      paddle.speed = newSpeed;
    },
    moveLeft: function() {
      this.x -= this.speed;
    },
    moveRight: function() {
      this.x += this.speed;
    }
  },

  Ball: {
    create: function(x = 50, y = 50, dx = 2, dy = 3, r = 10, color = 'red') {
      var ball = Object.create(this);
      ball.x = x;
      ball.y = y;
      ball.dx = dx;
      ball.dy = dy;
      ball.r = r;
      ball.color = color || 'black';
      return ball;
    },
    move: function() {
      this.x += this.dx;
      this.y += this.dy;
    },
    collisionDetect: function(canvasW, canvasH, paddleX, paddleY, paddleW, bricks) {
      //ball reach bottom of canvas
      if (this.y > canvasH) {
        Game.End();
      }
      //ball react top,right,left side of canvas
      if (this.x > canvasW || this.x < 0) {
        this.dx = -this.dx;
      } else if (this.y < 0) {
        this.dy = -this.dy;
      }

      //ball reach paddle
      if (this.y > canvasH - (canvasH - paddleY)) {
        if (this.x > paddleX && this.x < paddleX + paddleW) {
          this.dy = -this.dy;
        }
      }

      for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
          var b = bricks[c][r];
          if (b.alive) {
            if (
              this.x > b.x &&
              this.x < b.x + brickWidth &&
              this.y > b.y &&
              this.y < b.y + brickHeight
            ) {
              this.dy = -this.dy;
              b.kill();
            }
          }
        }
      }

      //ball reach brick
    }
  },
  Brick: {
    alive: true,
    create: function(x, y, w, h, color) {
      var brick = Object.create(this);
      brick.x = x;
      brick.y = y;
      brick.w = w;
      brick.h = h;
      brick.color = color || 'black';
      return brick;
    },
    kill: function() {
      this.alive = false;
    }
  }
};

/**
 * Game Action
 * Including game functionality
 */

Game.Action = {
  canvas: document.getElementById('canvas'),
  ctx: canvas.getContext('2d'),

  Init: function() {
    this.ball = Game.Component.Ball.create();
    this.paddle = Game.Component.Paddle.create();

    this.bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        this.bricks[c][r] = Game.Component.Brick.create(
          c * (brickWidth + brickPadding) + brickOffsetLeft,
          r * (brickHeight + brickPadding) + brickOffsetTop,
          50,
          20
        );
      }
    }

    Game.Event.RegisterAction('a', () => {
      this.paddle.moveLeft();
    });
    Game.Event.RegisterAction('d', () => {
      this.paddle.moveRight();
    });
    Game.Event.RegisterAction('w', () => {
      this.Stop();
    });
  },

  Draw: function() {
    this.Clear();
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2, true);
    this.ctx.stroke();
    this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h);

    //draw bricks
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (this.bricks[c][r].alive) {
          this.ctx.fillRect(
            this.bricks[c][r].x,
            this.bricks[c][r].y,
            this.bricks[c][r].w,
            this.bricks[c][r].h
          );
        }
      }
    }

    this.ctx.closePath();

    this.ball.move();
  },
  Clear: function() {
    this.ctx.clearRect(0, 0, 400, 400);
  },
  Start: function() {
    var actions = Object.keys(Game.Event.actions);
    for (let i = 0; i < actions.length; i++) {
      let key = actions[i];
      if (Game.Event.keydowns[key]) {
        Game.Event.actions[key]();
      }
    }

    this.ball.collisionDetect(
      this.canvas.width,
      this.canvas.height,
      this.paddle.x,
      this.paddle.y,
      this.paddle.w,
      this.bricks
    );
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
  Game.Event.AddListener(document, 'keydown', e => {
    //pause game for debug
    if (e.key == ' ') {
      Game.Action.Stop();
    } else if (e.key == 'g') {
      Game.Action.Start();
    }

    Game.Event.keydowns[e.key] = true;
  });

  Game.Event.AddListener(document, 'keyup', e => {
    Game.Event.keydowns[e.key] = false;
  });

  Game.Action.Start();
}

main();
