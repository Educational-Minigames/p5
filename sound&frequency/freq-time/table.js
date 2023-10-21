class Table {
    constructor(axes, xNumbers, yNumbers, graphs) {
      this.axes = axes;
      this.xNumbers = xNumbers;
      this.yNumbers = yNumbers;
      this.graphs = graphs;
      this.xSpacing = axes.xLength / (xNumbers.length + 1);
      this.ySpacing = (2 * axes.yLength) / yNumbers.length ** 2 - 3;
    }
  
    display() {
      textAlign(CENTER);
      textSize(20);
      for (let i = 0; i < this.xNumbers.length; i++) {
        stroke(this.graphs[i].coloring);
        linedash(
          this.axes.xOrigin + (i + 1) * this.xSpacing,
          this.axes.yOrigin + (i % 2) * 28,
          this.axes.xOrigin + (i + 1) * this.xSpacing,
          this.axes.yOrigin - this.axes.yLength,
          4
        );
        text(
          this.xNumbers[i],
          this.axes.xOrigin + (i + 1) * this.xSpacing,
          this.axes.yOrigin + 25  + (i % 2) * 15
        );
      }
      stroke(this.axes.coloring);
      for (let i = 0; i < this.yNumbers.length; i++) {
        linedash(
          this.axes.xOrigin,
          this.axes.yOrigin - this.ySpacing * 2 ** i,
          this.axes.xOrigin + this.axes.xLength,
          this.axes.yOrigin - this.ySpacing * 2 ** i,
          5
        );
        text(
          this.yNumbers[i],
          this.axes.xOrigin - 15,
          this.axes.yOrigin - this.ySpacing * 2 ** i + 4
        );
      }
      this.axes.drawAxes();
  
      strokeWeight(2);
      fill(0, 0, 0);
      for (let i = 0; i < this.xNumbers.length; i++) {
        stroke(this.graphs[i].coloring);
        if (graphs[i].multiplier == 0) fill(this.graphs[i].coloring);
        circle(
          this.axes.xOrigin + (i + 1) * this.xSpacing,
          this.axes.yOrigin,
          14
        );
        fill(0, 0, 0);
        for (let j = 0; j < this.yNumbers.length; j++) {
          stroke(this.graphs[i].coloring);
          if (graphs[i].multiplier == 2 ** j) fill(this.graphs[i].coloring);
          circle(
            this.axes.xOrigin + (i + 1) * this.xSpacing,
            this.axes.yOrigin - this.ySpacing * 2 ** j,
            14
          );
          fill(0, 0, 0);
        }
      }
      strokeWeight(3);
    }
    mouseClicked() {
      for (let i = 0; i < this.xNumbers.length; i++) {
        if (7 >= dist(this.axes.xOrigin + (i + 1) * this.xSpacing,this.axes.yOrigin, mouseX, mouseY)) {
          this.graphs[i].setMultiplier(0);
          return;
        }
        for (let j = 0; j < this.yNumbers.length; j++) {
          if (7 >= dist(this.axes.xOrigin + (i + 1) * this.xSpacing,this.axes.yOrigin - this.ySpacing * 2 ** j,
              mouseX, mouseY)) {
            this.graphs[i].setMultiplier(2 ** j);
            return;
          }
        }
      }
    }
  }
  