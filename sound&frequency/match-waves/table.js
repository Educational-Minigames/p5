class Table {
  constructor(axes, xNumbers, yNumbers, graphs) {
    this.axes = axes;
    this.xNumbers = xNumbers;
    this.yNumbers = yNumbers;
    this.graphs = graphs;
    this.xSpacing = axes.xLength / (xNumbers.length + 1);
    this.ySpacing = axes.yLength / axes.yRange[0];
    this.oscillators = [];
    this.setOscillators();
    this.isPLaying = false;
  }

  setOscillators() {
    for(let i = 0; i < this.graphs.length; i++){
      let osc = new p5.Oscillator();
      osc.freq((i + 1) * 200);
      osc.start();
      osc.amp(0);
      // osc.stop();
      this.oscillators.push(osc);
    }
  }
  
  setGoal(goal) {
    this.goalGraph = goal;
    for (let graph of this.graphs) graph.setMultiplier(0);
  }

  checkGoal() {
    for (let i = 0; i < this.graphs.length; i++)
      if (i != this.goalGraph[0] && this.graphs[i].multiplier != 0) return false;
    
    return (this.graphs[this.goalGraph[0]].multiplier == this.yNumbers[0]);
    // returns true if goal is done
  }
  
  display() {
    textAlign(CENTER);
    textSize(16);
    colorMode(HSB);
    for (let i = 0; i < this.xNumbers.length; i++) {
      stroke(color(i * 51, 255, 255));
      linedash(
        this.axes.xOrigin + (i + 1) * this.xSpacing,
        this.axes.yOrigin,
        this.axes.xOrigin + (i + 1) * this.xSpacing,
        this.axes.yOrigin - this.axes.yLength,
        4
      );
      text(
        this.xNumbers[i],
        this.axes.xOrigin + (i + 1) * this.xSpacing,
        this.axes.yOrigin + 25
      );
    }
    stroke(this.axes.coloring);
    for (let i = 0; i < this.yNumbers.length; i++) {
      linedash(
        this.axes.xOrigin,
        this.axes.yOrigin - this.ySpacing * this.yNumbers[i],
        this.axes.xOrigin + this.axes.xLength,
        this.axes.yOrigin - this.ySpacing * this.yNumbers[i],
        5
      );
      strokeWeight(0);
      text(
        this.yNumbers[i],
        this.axes.xOrigin - 15,
        this.axes.yOrigin - this.ySpacing * this.yNumbers[i]
      );
      strokeWeight(3);
    }
    this.axes.drawAxes();
    for (let i = 0; i < this.xNumbers.length; i++) {
      stroke(this.graphs[i].coloring);
      if (this.graphs[i].multiplier == 0) fill(this.graphs[i].coloring);
      circle(
        this.axes.xOrigin + (i + 1) * this.xSpacing,
        this.axes.yOrigin,
        14
      );
      fill(0, 0, 0);
      for (let j = 0; j < this.yNumbers.length; j++) {
        stroke(this.graphs[i].coloring);
        if (this.graphs[i].multiplier == this.yNumbers[j])
          fill(this.graphs[i].coloring);
        circle(
          this.axes.xOrigin + (i + 1) * this.xSpacing,
          this.axes.yOrigin - this.ySpacing * this.yNumbers[j],
          14
        );
        fill(0, 0, 0);
      }
    }

    strokeWeight(2);
    fill(0, 0, 0);
    strokeWeight(3);
  }
  mouseClicked(playing) {
    for (let i = 0; i < this.xNumbers.length; i++) {
      if (7 >=dist(
            this.axes.xOrigin + (i + 1) * this.xSpacing,
            this.axes.yOrigin,
            mouseX,
            mouseY)
      ) {
        this.graphs[i].setMultiplier(0);
        this.oscillators[i].amp(0);
        
        return this.checkGoal();
      }
      for (let j = 0; j < this.yNumbers.length; j++) {
        if (
          7 >=
          dist(
            this.axes.xOrigin + (i + 1) * this.xSpacing,
            this.axes.yOrigin - this.ySpacing * this.yNumbers[j],
            mouseX,
            mouseY
          )
        ) {
          for (let k = 0; k < this.xNumbers.length; k++) {
            if (this.graphs[k].multiplier == this.yNumbers[j]) {
              this.graphs[k].setMultiplier(0);
              this.oscillators[k].amp(0);
            }
          }
          this.graphs[i].setMultiplier(this.yNumbers[j]);
          if (playing) this.oscillators[i].amp(this.yNumbers[j]);
          return this.checkGoal();
        }
      }
    }
    return this.checkGoal();
  }
  pause() {
    for(let i = 0; i < this.oscillators.length; i++) {
        this.oscillators[i].amp(0);
    }
    // console.log("here");
  }
  play() {
    for(let i = 0; i < this.oscillators.length; i++) {
        this.oscillators[i].amp(this.graphs[i].multiplier);
        this.oscillators[i].start();
    }
  }
}