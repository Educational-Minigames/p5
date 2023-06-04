const COLORS = {
  YELLOW: "yellow",
  GREEN: "green",
  BLUE: "blue",
  RED: "red",
}

const ASPECT_RATIO = [4, 3];

let graphArray = {};
let stateArray = {};
let imageArray = {};

let arrow;
let font;

let timer = [];

let maxState;
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
  Object.entries(graph).forEach(([key]) => {
    imageArray[key] = loadImage(`assets/${key}.png`);
  });

  arrow = loadImage("assets/arrow.png");
  font = loadFont("assets/vazir.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  csp = new CSP();

  div = createDiv('');
  div.style('width', '260px');
  div.style('height', '95px');
  div.style('background-color', '#00000020');

  prev = createButton('قبلی');
  prev.style('font-family', 'vazir');
  prev.style('font-size', '13px');
  prev.mousePressed(prevState);
  pause = createButton('⏸️');
  pause.mousePressed(pauseCallback);
  play = createButton('▶️');
  play.mousePressed(playCallback);
  next = createButton('بعدی');
  next.style('font-family', 'vazir');
  next.style('font-size', '13px');
  next.mousePressed(nextState);

  mrv = createCheckbox('انتخاب ترسناک‌ترین متغیر', true);
  mrv.style('font-family', 'vazir');
  mrv.style('font-size', '13px');
  mrv.changed(mrvChanged);
  lcv = createCheckbox('انتخاب بی‌دردسر‌ترین مقدار', true);
  lcv.style('font-family', 'vazir');
  lcv.style('font-size', '13px');
  lcv.changed(lcvChanged);
  sel = createSelect();
  sel.style('font-family', 'vazir');
  sel.style('font-size', '13px');
  sel.changed(mySelectEvent);

  Object.entries(graph).forEach(([key, value]) => {
    let g = new Graph();
    value.points.forEach((p) => {
      g.addNode(new Node(p[0], p[1]));
    });
    value.edges.forEach((e) => {
      g.addEdge(e[0], e[1]);
    });
    g.shuffle();
    graphArray[key] = g;
    sel.option(key);
  });

  state = 0;
  maxState = false;
  map = Object.entries(graph)[0][0];
  stateArray[map] = csp.solve(graphArray[map], mrv.checked(), lcv.checked());
}

function draw() {
  background(220);

  tint(255, 128);
  image(imageArray[map], 0, 0, windowWidth, windowHeight);

  stateArray[map][state].draw();

  fill('black');
  textSize(16);
  textAlign("center");
  text(`${state + 1}/${maxState ? "!!!" : stateArray[map].length}`, windowWidth - 128, 28);

  prev.position(windowWidth - 246, 10);
  pause.position(windowWidth - 195, 10);
  play.position(windowWidth - 100, 10);
  next.position(windowWidth - 56, 10);
  mrv.position(windowWidth - 250, 45);
  lcv.position(windowWidth - 250, 65);
  sel.position(windowWidth - 80, 45);
  div.position(windowWidth - 260, 0);
}

function mySelectEvent() {
  for (let i = 0; i < timer.length; i++)
    clearInterval(timer[i]);

  timer = [];
  map = sel.value();
  stateArray[map] = csp.solve(graphArray[map], mrv.checked(), lcv.checked());
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
  for (let i = 0; i < timer.length; i++)
    clearInterval(timer[i]);

  timer = [];
  stateArray[map] = csp.solve(graphArray[map], mrv.checked(), lcv.checked());
  state = 0;
}

function lcvChanged() {
  for (let i = 0; i < timer.length; i++)
    clearInterval(timer[i]);

  timer = [];
  stateArray[map] = csp.solve(graphArray[map], mrv.checked(), lcv.checked());
  state = 0;
}

function playCallback() {
  timer.push(setInterval(() => {
    if (state < stateArray[map].length - 1) {
      state++;
    }
  }, 500))
}

function pauseCallback() {
  for (let i = 0; i < timer.length; i++)
    clearInterval(timer[i]);

  timer = [];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Node {
  constructor(x, y, adj, domain, color) {
    this.pos = createVector(x, y);
    this.adj = adj || [];
    this.domain = domain || Object.values(COLORS).sort(() => Math.random() - 0.5);
    this.color = color || "";
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

  shuffle() {
    // Shuffle the node order
    for (let i = this.nodes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.nodes[i], this.nodes[j]] = [this.nodes[j], this.nodes[i]];
      for (let k = 0; k < this.nodes.length; k++) {
        this.nodes[k].adj = this.nodes[k].adj.map(id => id === i ? j : id === j ? i : id);
      }
    }
  }

}

class GraphState {
  constructor(graph, nextNode) {
    this.nodes = graph.nodes.map(node => new Node(node.pos.x, node.pos.y, node.adj, node.domain, node.color));
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
    const nodeDiameter = windowHeight * windowWidth / 40000 + 10;
    this.nodes.forEach(node => {
      fill(node.color === "" ? 'white' : node.color);
      circle((node.pos.x * windowWidth), (node.pos.y * windowHeight), nodeDiameter);
    })
    const domainDiameter = windowHeight * windowWidth / 160000 + 5;
    this.domains.forEach((domain, i) => {
      const node = this.nodes[i];
      if (node.color !== "") {
        return;
      }
      Object.values(COLORS).filter(color => domain.includes(color)).forEach((color, j) => {
          fill(color);
          circle(
            (node.pos.x * windowWidth) + domainDiameter * (j - (domain.length - 1) / 2),
            (node.pos.y * windowHeight) + nodeDiameter / 2 + domainDiameter / 2,
            domainDiameter
          );
      });
    });
    const arrowDiameter = windowHeight * windowWidth / 160000 + 5;
    if (this.nextNode) {
      noTint();
      document.getElementById("arrow").style.left = `${(this.nextNode.pos.x * windowWidth) - arrowDiameter}px`;
      document.getElementById("arrow").style.top = `${(this.nextNode.pos.y * windowHeight) - nodeDiameter / 2 - 3 * arrowDiameter}px`;
      document.getElementById("arrow").style.width = `${2 * arrowDiameter}px`;
      document.getElementById("arrow").style.height = `${3 * arrowDiameter}px`;
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
    const neighbors = node.adj.map(id => graph.nodes[id]);
    const neighborColors = neighbors.map(node => node.color);
    return node.domain.filter(color => !neighborColors.includes(color));
  }

  backtrack(graph, mrv, lcv) {
    if (graph.nodes.every(node => node.color !== "")) {
      this.states.push(new GraphState(graph));
      maxState = false;
      return true;
    }
    const node = mrv ? this.MRV(graph) : graph.nodes.find(node => node.color === "");
    const domain = lcv ? this.LCV(graph, node) : this.findNodeDomain(node, graph);

    for (let i = 0; i < domain.length; i++) {
      node.removeColor();
      this.states.push(new GraphState(graph, node));
      node.setColor(domain[i]);
      if (this.states.length > 1000) {
        maxState = true;
        return false;
      }
      const result = this.backtrack(graph, mrv, lcv);

      if (result) {
        return true;
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


