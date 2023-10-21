class Axes {
  constructor(
    xOrigin,
    yOrigin,
    xLength, // [x_max, x_step]
    yLength, // [y_max, y_step]
    xRange, // length of the x_axis in canvas
    yRange // length of the y_axis in canvas
  ) {
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;
    this.coloring = color(0, 0, 0);
    this.xRange = xRange;
    this.yRange = yRange;
    this.xLength = xLength;
    this.yLength = yLength;
    this.xLabel = "x";
    this.yLabel = "y";
    this.includeNegative = true;
    this.graphs = [];
    this.xSpacing = xLength / xRange[0];
    this.ySpacing = yLength / yRange[0];
  }

  drawAxes() {
    strokeWeight(4);
    stroke(this.coloring);
    fill(0);
    line(this.xOrigin, this.yOrigin, this.xOrigin + this.xLength, this.yOrigin);
    if(this.includeNegative)
      line(
        this.xOrigin,
        this.yOrigin + this.yLength,
        this.xOrigin,
        this.yOrigin - this.yLength
      );
    else line(
        this.xOrigin,
        this.yOrigin,
        this.xOrigin,
        this.yOrigin - this.yLength
      );
    triangle(
     this.xOrigin + this.xLength ,
      this.yOrigin + 3,
      this.xOrigin + this.xLength ,
      this.yOrigin - 3,
      this.xOrigin + this.xLength + 8,
      this.yOrigin
    );
    triangle(
      this.xOrigin + 3,
      this.yOrigin - this.yLength + 8,
      this.xOrigin - 3,
      this.yOrigin - this.yLength + 8,
      this.xOrigin,
      this.yOrigin - this.yLength
    );

  } //done

  drawGraph(graph) {
    colorMode(HSB)
    stroke(graph.coloring);
    strokeWeight(graph.thickness);
    let x = 0;
    beginShape(LINES);
    while(x + graph.dx < this.xRange[0]) {
      vertex(this.c2p(x, graph.getValue(x)).x, this.c2p(x, graph.getValue(x)).y);
      vertex(this.c2p(x + graph.dx, graph.getValue(x + graph.dx)).x, this.c2p(x + graph.dx, graph.getValue(x + graph.dx)).y);
      x += graph.dx;
    }
    
    vertex(this.c2p(this.xRange[0], graph.getValue(this.xRange[0])).x, this.c2p(this.xRange[0], graph.getValue(this.xRange[0])).y);
    endShape();
  }
  
  drawGraphs() {
    for(const subGraph of graphs)
        this.drawGraph(subGraph);
  }
  
  pushGraphs(dx) {
    for(const subGraph of graphs)
        subGraph.offsetX(dx);
  }
  
  drawSumGraph(thickness, coloring) {
    function sum(x, graphs) {
      var res = 0;
      for(const subGraph of graphs) {
        res += subGraph.getValue(x);
      }
      return res;
    }
    
    this.drawGraph(new Graph(x => sum(x, this.graphs), 0.01, coloring, thickness, false));
  }
  
  c2p(X, Y) {
    return createVector(this.xOrigin + X * this.xSpacing,
                       this.yOrigin - Y * this.ySpacing)
  }
  
  
  setColoring(coloring) {
    this.coloring = coloring;
  }
  setXLabel(label) {
    this.xLabel = label;
  }
  setYLabel(label) {
    this.yLabel = label;
  }
  setIncludeNegative(includeNegative) { this.includeNegative = includeNegative; }
  addGraph(graph) {
    this.graphs.push(graph);
  }
  removeGraph(graph) {
    this.graphs = this.graphs.filter((x) => x != graph);
  }
}
