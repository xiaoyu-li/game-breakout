var Game = Game || {};

Game.Event = {
  AddListener: function(el, type, fn) {},
  RemoveListener: function(el, type, fn) {},
  GetEvent: function(e) {}
};

Game.Component = {
  Stage: {
    console: {}
  },
  Paddle: {
    create: function(x, y, w, h, color, speed) {
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
    }
  },
  Ball: {
    create: function(x, y, dx, dy, r) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.r = r;
    },
    move: function() {
      this.x += this.dx;
      this.y += this.dy;
    }
  },
  Brick: {}
};

Game.Action = {
  canvas: document.getElementById('canvas'),
  ctx: canvas.getContext('2d'),
  paddle: new Game.Component.Paddle.create(0, 0, 30, 30, 'red', 10),
  Init: function() {
    this.ball = Object.create(Game.Component.Ball);
    this.ball.create(50, 50, 5, 5, 10);
  },
  Draw: function() {
    this.ctx.clearRect(0, 0, 400, 400);
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();
    this.ball.move();
  }
};
Game.Action.Init();

function main() {
  Game.Action.Draw();
  requestAnimationFrame(main);
}

main();
