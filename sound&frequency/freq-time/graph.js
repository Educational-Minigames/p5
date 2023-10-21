class Graph {
  constructor(func, dx, coloring, thickness, freq, hasOsc) {
    this.thickness = thickness;
    this.func = func;
    this.dx = dx;
    this.coloring = coloring;
    this.xOffset = 0;
    this.yOffset = 0;
    this.multiplier = 1;
    if(hasOsc) {
      this.multiplier = 0;
      this.osc = new p5.Oscillator();
      this.osc.start();
      this.osc.freq(freq);
      this.osc.amp(0);
      this.osc.stop();
      this.started = false;
    }
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
    // if(multiplier == 0)
    //   return this.osc.stop();
    // this.osc.start();
    this.osc.amp(this.multiplier / 8);
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