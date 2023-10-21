class Graph {
  constructor(func, dx, coloring, thickness, hasOsc) {
    this.thickness = thickness;
    this.func = func;
    this.dx = dx;
    this.coloring = coloring;
    this.xOffset = 0;
    this.yOffset = 0;
    this.yMultiplier = 1;
    this.xMultiplier = 440;
    if(hasOsc) {
      this.osc = new p5.Oscillator();
      this.osc.start();
      this.osc.freq(440);
      this.osc.amp(1);
      this.started = true;
    }
  }
  
  offsetX(dx) {
    this.xOffset += dx;
  }
  offsetY(dy) {
    this.yOffset += dy;
  }
  
  getValue(x) {
    return this.yMultiplier * this.func(x * this.xMultiplier + this.xOffset) + this.yOffset;
  }
  
  setYMultiplier(multiplier) {
    this.yMultiplier = multiplier;
    // if(multiplier == 0)
    //   return this.osc.stop();
    // this.osc.start();
    this.osc.amp(this.yMultiplier);
  }
  
  setXMultiplier(multiplier, order) {
    this.xMultiplier = multiplier / order;
    this.osc.freq(multiplier);
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