const COLORS = {
  RED: "red",
  BLUE: "blue",
  GREEN: "green",
  // YELLOW: "yellow",
}

let graph1;
let graph1States;
let state;
let csp;
let next;
let prev;
let mrv;
let lcv;

function setup() {
  createCanvas(windowWidth, windowHeight);
  graph1 = new Graph();
  graph1.addNode(new Node(100, 100));
  graph1.addNode(new Node(200, 100));
  graph1.addNode(new Node(300, 100));
  graph1.addNode(new Node(100, 200));
  graph1.addNode(new Node(200, 200));
  graph1.addNode(new Node(300, 200));
  graph1.addEdge(0, 1);
  graph1.addEdge(0, 3);
  graph1.addEdge(1, 2);
  graph1.addEdge(1, 4);
  graph1.addEdge(2, 5);
  graph1.addEdge(3, 4);
  graph1.addEdge(4, 5);
  graph1.addEdge(3, 1);
  graph1.addEdge(4, 2);

  csp = new CSP();
  graph1States = csp.solve(graph1);
  state = 0;

  prev = createButton('prev');
  prev.position(0, 0);
  prev.mousePressed(prevState);
  next = createButton('next');
  next.position(60, 0);
  next.mousePressed(nextState);
  mrv = createCheckbox('MRV', true);
  mrv.position(120, 0);
  mrv.changed(mrvChanged);
  lcv = createCheckbox('LCV', true);
  lcv.position(180, 0);
  lcv.changed(lcvChanged);
}

function nextState() {
  if (state < graph1States.length - 1) {
    state++;
  }
}

function prevState() {
  if (state > 0) {
    state--;
  }
}

function mrvChanged() {
  graph1States = csp.solve(graph1, mrv.checked(), lcv.checked());
  state = 0;
}

function lcvChanged() {
  graph1States = csp.solve(graph1, mrv.checked(), lcv.checked());
  state = 0;
}

function draw() {
  background(220);
  graph1States[state].draw();
  text(state + 1, 45, 15);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Node {
  constructor(x, y, adj) {
    this.pos = createVector(x, y);
    this.adj = adj || [];
    this.color = "";
  }

  addNeighbor(id) {
    this.adj.push(id);
  }

  setColor(color) {
    this.color = color;
  }

  removeColor() {
    this.color = "";
  }
}

class Graph {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
  }

  addEdge(id1, id2) {
    this.nodes[id1].addNeighbor(id2);
    this.nodes[id2].addNeighbor(id1);
  }

  reset() {
    this.nodes.forEach(node => node.removeColor());
  }
}

class GraphState {
  constructor(graph) {
    this.nodes = graph.nodes.map(node => new Node(node.pos.x, node.pos.y, node.adj));
    this.nodes.forEach((node, i) => node.setColor(graph.nodes[i].color));
    this.domains = this.nodes.map(node => csp.findNodeDomain(node, graph));
  }

  draw() {
    this.nodes.forEach((node) => {
      node.adj.forEach(id => {
        const node2 = this.nodes[id];
        line(node.pos.x, node.pos.y, node2.pos.x, node2.pos.y);
      });
    });
    this.nodes.forEach(node => {
      fill(node.color === "" ? 'white' : node.color);
      circle(node.pos.x, node.pos.y, 30);
    })
    this.domains.forEach((domain, i) => {
      const node = this.nodes[i];
      if (node.color !== "") {
        return;
      }
      domain.forEach((color, i) => {
        fill(color);
        circle(node.pos.x + 10 * (i - 1), node.pos.y - 20, 10);
      });
    });
  }
}

class CSP {
  constructor() {
    this.states = [];
  }

  solve(graph, mrv = true, lcv = true) {
    this.states = [];
    graph.reset();
    this.backtrack(graph, mrv, lcv);
    console.log(this.states);
    return this.states;
  }

  findNodeDomain(node, graph) {
    const domain = Object.values(COLORS);
    const neighbors = node.adj.map(id => graph.nodes[id]);
    const neighborColors = neighbors.map(node => node.color);
    return domain.filter(color => !neighborColors.includes(color));
  }

  backtrack(graph, mrv, lcv) {
    this.states.push(new GraphState(graph));
    if (graph.nodes.every(node => node.color !== "")) {
      return true;
    }
    const node = mrv ? this.MRV(graph) : graph.nodes.find(node => node.color === "");
    const domain = lcv ? this.LCV(graph, node) : this.findNodeDomain(node, graph);
    for (let i = 0; i < domain.length; i++) {
      node.setColor(domain[i]);
      const result = this.backtrack(graph, mrv, lcv);

      if (result) {
        return result;
      }
    }
    if (domain.length > 0) {
      node.removeColor();
      this.states.push(new GraphState(graph));
    }
    return false;
  }

  MRV(graph) {
    let min = Infinity;
    let minNode;
    graph.nodes.forEach(node => {
      if (node.color !== "") {
        return;
      }
      const domain = this.findNodeDomain(node, graph);
      if (domain.length < min) {
        min = domain.length;
        minNode = node;
      }
    });
    return minNode;
  }

  LCV(graph, node) {
    const domain = this.findNodeDomain(node, graph);
    const neighbors = node.adj.map(id => graph.nodes[id]);
    const neighborColors = neighbors.map(node => node.color);
    return domain.sort((a, b) => {
      const aCount = neighborColors.filter(color => color === a).length;
      const bCount = neighborColors.filter(color => color === b).length;
      return aCount - bCount;
    });
  }

}


