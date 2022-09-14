(() => {
  function rng(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  const offX = 2;
  const offY = 2;
  const width = 10;
  const height = 10;

  class Snake {
    ctx;
    tail = [];
    x = 5;
    y = 5;
    foodX = 0;
    foodY = 0;
    direction = "up";
    alive = true;
    interval;
    pause;

    constructor(ctx) {
      this.ctx = ctx;
      document.body.addEventListener("keydown", this.onKey.bind(this));
      document.body.addEventListener("keyup", this.onKeyUp.bind(this));
      this.interval = setInterval(this.loop.bind(this), 400);
      this.createFood();
    }

    loop() {
      if (this.pause) return;
      this.tail.unshift([this.x, this.y]);
      this.tail.pop();

      if (this.direction === "up") --this.y;
      else if (this.direction === "down") ++this.y;
      else if (this.direction === "left") --this.x;
      else if (this.direction === "right") ++this.x;

      const hit = this.checkHit(this.x, this.y);
      console.log(this.x, this.y, hit);

      if (hit === "wall" || hit === "tail") {
        this.die();
        return;
      }
      if (hit === "food") {
        this.tail.unshift([this.x, this.y]);
        this.createFood();
      }
      this.draw();
    }

    createFood() {
      const food = [rng(1, 10), rng(1, 10)];
      while (this.checkHit(food[0], food[1]) !== "none") {
        food[0] = rng(1, 10);
        food[1] = rng(1, 10);
      }
      this.foodX = food[0];
      this.foodY = food[1];
    }

    checkHit(x, y) {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return "wall";
      }
      for (const [tailx, taily] of this.tail) {
        if (tailx === x && taily === y) return "tail";
      }
      if (x === this.foodX && y === this.foodY) return "food";
      if (x === this.x && y === this.y) return "head";
      return "none";
    }

    die() {
      clearInterval(this.interval);
      this.alive = false;
      this.draw();
    }

    draw() {
      this.ctx.clearRect(0, 0, 500, 500);
      for (const [x, y] of this.tail) {
        this.drawTail(x, y);
      }
      for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
          if (x === this.x && y === this.y) this.drawHead(x, y);
          else if (x === this.foodX && y === this.foodY) this.drawFood(x, y);
        }
      }
    }

    onKey(e) {
      const key = e.key;
      if (key === "ArrowLeft" && this.direction !== "right")
        this.direction = "left";
      else if (key === "ArrowRight" && this.direction !== "left")
        this.direction = "right";
      else if (key === "ArrowUp" && this.direction !== "down")
        this.direction = "up";
      else if (key === "ArrowDown" && this.direction !== "up")
        this.direction = "down";
      else if (key === " ") this.pause = true;
      this.draw();
    }
    onKeyUp(e) {
      const key = e.key;
      if (key === " ") this.pause = false;
    }
    drawWall(x, y) {
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(x * 50, y * 50, 50, 50);
    }
    drawHead(x, y) {
      this.ctx.fillStyle = this.alive ? "blue" : "red";
      this.ctx.fillRect(x * 50, y * 50, 50, 50);
      this.ctx.beginPath();
      this.ctx.strokeStyle = "white";
      this.ctx.resetTransform();
      this.ctx.translate(x * 50 + 25, y * 50 + 25);
      if (this.direction === "right") this.ctx.rotate((90 * Math.PI) / 180);
      else if (this.direction === "down")
        this.ctx.rotate((180 * Math.PI) / 180);
      else if (this.direction === "left")
        this.ctx.rotate((270 * Math.PI) / 180);
      this.ctx.moveTo(-15, 0);
      this.ctx.lineTo(0, -15);
      this.ctx.lineTo(15, 0);
      this.ctx.stroke();
      this.ctx.resetTransform();
    }
    drawTail(x, y) {
      this.ctx.fillStyle = this.alive ? "darkblue" : "darkred";
      this.ctx.fillRect(x * 50, y * 50, 50, 50);
    }
    drawEmpty(x, y) {
      this.ctx.clearRect(x * 50, y * 50, 50, 50);
    }
    drawFood(x, y) {
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(x * 50, y * 50, 50, 50);
    }
  }

  function onKeyDown(e) {
    console.log(e);
  }
  function onLoad() {
    const ctx = document.getElementById("canvas").getContext("2d");
    const snake = new Snake(ctx);
  }

  document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
      onLoad();
    }
  };
})();
