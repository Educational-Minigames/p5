class Graph {
  constructor(func, dx, coloring, thickness) {
    this.thickness = thickness;
    this.func = func;
    this.dx = dx;
    this.coloring = coloring;
    this.xOffset = 0;
    this.yOffset = 0;
    this.multiplier = 1;
  }
  
  offsetX(dx) {
    this.xOffset += dx;
  }
  offsetY(dy) {
    this.yOffset += dy;
  }
  
  getValue(x) {
    return this.multiplier * this.func(x + this.xOffset) + this.yOffset;
  }
  
  setMultiplier(multiplier) {
    this.multiplier = multiplier;
  }
  
  pause() {
    if(this.started) {
      this.osc.stop();
      this.started = false;
    }
    else {
      this.osc.start();
      this.started = true;
    }
  }
  
}