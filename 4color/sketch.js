const COLORS = {
  YELLOW: "yellow",
  GREEN: "green",
  BLUE: "blue",
  RED: "red",
}

let graphArray = {};
let stateArray = {};
let imageArray = {};

let arrow;

let timer;

let state;
let map;
let csp;

let pause;
let play;
let next;
let prev;
let mrv;
let lcv;
let sel;
let div;

function preload() {
  Object.entries(graph).forEach(([key, value]) => {
    imageArray[key] = loadImage(`${key}.png`);
  });

  arrow = loadImage("arrow.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  csp = new CSP();

  div = createDiv('');
  div.style('width', '220px');
  div.style('height', '80px');
  div.style('background-color', '#00000020');

  prev = createButton('prev');
  prev.mousePressed(prevState);
  pause = createButton('⏸️');
  pause.mousePressed(pauseCallback);
  play = createButton('▶️');
  play.mousePressed(playCallback);
  next = createButton('next');
  next.mousePressed(nextState);

  mrv = createCheckbox('MRV', true);
  mrv.changed(mrvChanged);
  lcv = createCheckbox('LCV', true);
  lcv.changed(lcvChanged);
  sel = createSelect();
  sel.changed(mySelectEvent);

  Object.entries(graph).forEach(([key, value]) => {
    let g = new Graph();
    value.points.forEach((p) => {
      g.addNode(new Node(p[0], p[1]));
    });
    value.edges.forEach((e) => {
      g.addEdge(e[0], e[1]);
    });
    graphArray[key] = g;
    let s = csp.solve(g, mrv.checked(), lcv.checked());
    stateArray[key] = s;
    sel.option(key);
  });

  state = 0;
  map = Object.entries(graph)[0][0];
}

function draw() {
  background(220);

  tint(255, 128);
  image(imageArray[map], 0, 0, windowWidth, windowHeight);

  stateArray[map][state].draw();

  fill('black');
  textSize(16);
  textAlign("center");
  text(state + 1, windowWidth - 108, 28);



  prev.position(windowWidth - 206, 10);
  pause.position(windowWidth - 160, 10);
  play.position(windowWidth - 95, 10);
  next.position(windowWidth - 56, 10);
  mrv.position(windowWidth - 210, 45);
  lcv.position(windowWidth - 150, 45);
  sel.position(windowWidth - 80, 40);
  div.position(windowWidth - 220, 0);
}

function mySelectEvent() {
  map = sel.value();
  state = 0;
}

function nextState() {
  if (state < stateArray[map].length - 1) {
    state++;
  }
}

function prevState() {
  if (state > 0) {
    state--;
  }
}

function mrvChanged() {
  stateArray[map] = csp.solve(graphArray[map], mrv.checked(), lcv.checked());
  state = 0;
}

function lcvChanged() {
  stateArray[map] = csp.solve(graphArray[map], mrv.checked(), lcv.checked());
  state = 0;
}

function playCallback() {
  timer = setInterval(() => {
    if (state < stateArray[map].length - 1) {
      state++;
    }
  }, 500)
}

function pauseCallback() {
  clearInterval(timer);
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
  constructor(graph, nextNode) {
    this.nodes = graph.nodes.map(node => new Node(node.pos.x, node.pos.y, node.adj));
    this.nodes.forEach((node, i) => node.setColor(graph.nodes[i].color));
    this.domains = this.nodes.map(node => csp.findNodeDomain(node, graph));
    this.nextNode = nextNode;
  }

  draw() {
    this.nodes.forEach((node) => {
      node.adj.forEach(id => {
        const node2 = this.nodes[id];
        line((node.pos.x * windowWidth), (node.pos.y * windowHeight), (node2.pos.x * windowWidth), (node2.pos.y * windowHeight));
      });
    });
    this.nodes.forEach(node => {
      fill(node.color === "" ? 'white' : node.color);
      circle((node.pos.x * windowWidth), (node.pos.y * windowHeight), 30);
    })
    this.domains.forEach((domain, i) => {
      const node = this.nodes[i];
      if (node.color !== "") {
        return;
      }
      domain.forEach((color, i) => {
        fill(color);
        circle((node.pos.x * windowWidth) + 10 * (i - 1.5), (node.pos.y * windowHeight) + 20, 10);
      });
    });
    if (this.nextNode) {
      noTint();
      image(arrow, (this.nextNode.pos.x * windowWidth) - 10, (this.nextNode.pos.y * windowHeight) - 45, 20, 30);
    }
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
    if (graph.nodes.every(node => node.color !== "")) {
      this.states.push(new GraphState(graph));
      return true;
    }
    const node = mrv ? this.MRV(graph) : graph.nodes.find(node => node.color === "");
    const domain = lcv ? this.LCV(graph, node) : this.findNodeDomain(node, graph);

    for (let i = 0; i < domain.length; i++) {
      node.removeColor();
      this.states.push(new GraphState(graph, node));
      node.setColor(domain[i]);
      const result = this.backtrack(graph, mrv, lcv);

      if (result) {
        return result;
      }
    }
    if (domain.length > 0) {
      node.removeColor();
    }
    this.states.push(new GraphState(graph, node));
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


