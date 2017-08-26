var Game = Game || {};
Game.End = function() {
  console.log('here');
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
    create: function(x, y, w, h, speed, color) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.speed = speed;
      this.color = color || 'black';
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
    create: function(x, y, dx, dy, r, color) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.r = r;
      this.color = color || 'black';
    },
    move: function() {
      this.x += this.dx;
      this.y += this.dy;
    },
    collisionDetect: function(canvasW, canvasH, paddleX, paddleY, paddleW) {
      if (this.y > canvasH) {
        console.log('123');
        Game.End();
      }
      if (this.x > canvasW || this.x < 0) {
        this.dx = -this.dx;
      } else if (this.y < 0) {
        this.dy = -this.dy;
      }

      if (this.y > canvasH - (canvasH - paddleY)) {
        if (this.x > paddleX && this.x < paddleX + paddleW) {
          this.dy = -this.dy;
        }
      }
    }
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
    this.ball.create(50, 50, 3, -3, 10, 'blue');
    this.paddle = Object.create(Game.Component.Paddle);
    this.paddle.create(50, 350, 50, 20, 5, 'red');

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
    this.ctx.fillRect(
      this.paddle.x,
      this.paddle.y,
      this.paddle.w,
      this.paddle.h
    );
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
      this.paddle.w
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
