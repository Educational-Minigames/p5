const colors = {
  bpiece: [0, 0, 0],
  wpiece: [255, 255, 255],
  bboard: [118, 150, 86],
  wboard: [238, 238, 210],
  chosen: [186, 202, 68],
  ray: [200, 80, 80],
};


class Board {
  constructor(n, blockSize, fix = []) {
    this.n = n;

    this.queen = loadImage('assets/queen.png');
    this.blockSize = blockSize;

    this.fixed = fix;
    this.movable = [[n, n-1], [n, n-2], [n, n-3], [n, n-4]];
    this.picked = null;
  }

  show(showRay = false) {
    this.showBoard();
    this.showQueens();
    if (showRay)
      this.showRays();
  }

  showBoard() {
    strokeWeight(0);
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if ((i + j) % 2 == 0) {
          fill(...colors.wboard);
        }
        else
          fill(...colors.bboard);
        square(this.blockSize * i, this.blockSize * j, this.blockSize);
      }
    }
    stroke(255);
    strokeWeight(6);
    noFill();
    square(0, 0, this.n * this.blockSize);
    stroke(0);
  }

  showQueens() {
    for (let i = 0; i < this.fixed.length; i++) {
      let x = this.fixed[i][0];
      let y = this.fixed[i][1];
      image(this.queen, x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
    }

    for (let i = 0; i < this.movable.length; i++) {
      let x = this.movable[i][0];
      let y = this.movable[i][1];
      image(this.queen, x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
    }

    if (this.picked) {
      let x = this.picked[0];
      let y = this.picked[1];
      image(this.queen, mouseX - this.blockSize / 2, mouseY - this.blockSize / 2, this.blockSize, this.blockSize);
    }
  }

  allSafe() {
    if (piecePicked) return false;
    for (let i = 0; i < this.n; i++)
      if (this.isThreatened(i)) return false;
    return true;
  }

  isThreatened(index) {
    let x = this.blocks[index][0];
    let y = this.blocks[index][1];
    for (let i = 0; i < this.blocks.length; i++) {
      if (i == index) continue;
      let X = this.blocks[i][0];
      let Y = this.blocks[i][1];
      if (x == X || y == Y)
        return true;
      if (Math.abs(x - X) == Math.abs(y - Y))
        return true;
    }
    return false;
  }

  pick() {
    let mousePos = createVector(mouseX, mouseY);
    for (let i = 0; i < this.movable.length; i++) {
      let pos = createVector(this.movable[i][0] * this.blockSize + this.blockSize / 2, this.movable[i][1] * this.blockSize + this.blockSize / 2);
      if (mousePos.dist(pos) < this.blockSize / 2) {
        this.picked = this.movable[i];
        this.movable.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  toggle() {
  }

  place() {
    let mousePos = createVector(mouseX, mouseY);
    if (mousePos.x < 0 || mousePos.x > this.n * this.blockSize || mousePos.y < 0 || mousePos.y > this.n * this.blockSize) {
      this.movable.push(this.picked);
      this.picked = null;
      return false;
    }
    let x = Math.floor(mousePos.x / this.blockSize);
    let y = Math.floor(mousePos.y / this.blockSize);
    // undo move if the place is already occupied
    for (let i = 0; i < this.fixed.length; i++) {
      if (this.fixed[i][0] == x && this.fixed[i][1] == y) {
        this.movable.push(this.picked);
        this.picked = null;
        return false;
      }
    }
    for (let i = 0; i < this.movable.length; i++) {
      if (this.movable[i][0] == x && this.movable[i][1] == y) {
        this.movable.push(this.picked);
        this.picked = null;
        return false;
      }
    }
    this.movable.push([x, y]);
    this.picked = null;
    return true;
  }

  reset() {
    this.movable = [[n, n-1], [n, n-2], [n, n-3], [n, n-4]];
  }

  showRays() {
    for (let i = 0; i < this.fixed.length; i++) {
      let x = this.fixed[i][0];
      let y = this.fixed[i][1];
      this.showRay(x, y);
    }
    for (let i = 0; i < this.movable.length; i++) {
      let x = this.movable[i][0];
      let y = this.movable[i][1];
      if (x == this.n) continue;
      this.showRay(x, y);
    }
  }

  showRay(x, y) {
    let diameter = this.blockSize / 3;
    strokeWeight(0.5);
    fill(...colors.ray);
    for (let i = 0; i < this.n; i++) {
      if (i != x)
        circle(this.blockSize * i + this.blockSize / 2, this.blockSize * y + this.blockSize / 2, diameter);
    }
    for (let i = 0; i < this.n; i++) {
      if (i != y)
        circle(this.blockSize * x + this.blockSize / 2, this.blockSize * i + this.blockSize / 2, diameter);
    }
    for (let i = 0; i < this.n; i++) {
      if (x + i + 1 < this.n && y + i < this.n)
        circle(this.blockSize * (x + i + 1) + this.blockSize / 2, this.blockSize * (y + i + 1) + this.blockSize / 2, diameter);
      if (x - i - 1 >= 0 && y - i - 1 >= 0)
        circle(this.blockSize * (x - i - 1) + this.blockSize / 2, this.blockSize * (y - i - 1) + this.blockSize / 2, diameter);
      if (x + i + 1 < this.n && y - i - 1 >= 0)
        circle(this.blockSize * (x + i + 1) + this.blockSize / 2, this.blockSize * (y - i - 1) + this.blockSize / 2, diameter);
      if (x - i - 1 >= 0 && y + i + 1 < this.n)
        circle(this.blockSize * (x - i - 1) + this.blockSize / 2, this.blockSize * (y + i + 1) + this.blockSize / 2, diameter);
    }
  }
}