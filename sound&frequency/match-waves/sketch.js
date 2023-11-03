var sumAxes, tableAxes1, tableAxes2, graphAxes1, graphAxes2, goalAxes;
var table1, table2;
var rand1, rand2;
var graphs1, graphs2;
var goalGraph;
var win;
var isPlaying, isPlaying1, isPlaying2;
var button, signal1Button, signal2Button;
var graphMade;
function preload() {
  bg = loadImage('../../assets/background.jpeg');
}
function setup() {
  isPlaying = false;
  isPlaying1 = false;
  isPlaying2 = false;
  graphMade = 0;
  win = false;
  createCanvas(600, 450);
  tableAxes1 = new Axes(50, 60, 200, 50, [4 * PI , 1], [1.2, 1]);
  tableAxes2 = new Axes(50, 170, 200, 30, [4 * PI , 1], [0.6, 1]);

  graphAxes1 = new Axes(320, 60 , 240, 50, [4 * PI , 1], [1, 1]);
  graphAxes2 = new Axes(320, 170, 240, 50, [4 * PI , 1], [1, 1]);
  sumAxes =    new Axes(320, 330, 240, 100, [4 * PI , 1], [2, 1]);
  goalAxes =   new Axes(50 , 330, 240, 100, [4 * PI , 1], [2, 1]);

  tableAxes1.setIncludeNegative(false);
  tableAxes2.setIncludeNegative(false);
  colorMode(HSB)
  graphs1 = [];
  graphs2 = [];
  graphs1.push(new Graph((x) => sin(1 * x), 0.05, color(0 * 51, 255, 255), 3));
  graphs1.push(new Graph((x) => sin(2 * x), 0.05, color(1 * 51, 255, 255), 3));
  graphs1.push(new Graph((x) => sin(3 * x), 0.05, color(2 * 51, 255, 255), 3));
  graphs1.push(new Graph((x) => sin(4 * x), 0.05, color(3 * 51, 255, 255), 3));
  graphs1.push(new Graph((x) => sin(5 * x), 0.05, color(4 * 51, 255, 255), 3));
  graphs2.push(new Graph((x) => (sin(1 * x)), 0.05, color(0 * 51, 255, 255), 3));
  graphs2.push(new Graph((x) => (sin(2 * x)), 0.05, color(1 * 51, 255, 255), 3));
  graphs2.push(new Graph((x) => (sin(3 * x)), 0.05, color(2 * 51, 255, 255), 3));
  graphs2.push(new Graph((x) => (sin(4 * x)), 0.05, color(3 * 51, 255, 255), 3));
  graphs2.push(new Graph((x) => (sin(5 * x)), 0.05, color(4 * 51, 255, 255), 3));
  sumAxes.addGraph(graphs1[0]);
  sumAxes.addGraph(graphs1[1]);
  sumAxes.addGraph(graphs1[2]);
  sumAxes.addGraph(graphs1[3]);
  sumAxes.addGraph(graphs1[4]);
  graphAxes1.addGraph(graphs1[0]);
  graphAxes1.addGraph(graphs1[1]);
  graphAxes1.addGraph(graphs1[2]);
  graphAxes1.addGraph(graphs1[3]);
  graphAxes1.addGraph(graphs1[4]);
  sumAxes.addGraph(graphs2[0]);
  sumAxes.addGraph(graphs2[1]);
  sumAxes.addGraph(graphs2[2]);
  sumAxes.addGraph(graphs2[3]);
  sumAxes.addGraph(graphs2[4]);
  graphAxes2.addGraph(graphs2[0]);
  graphAxes2.addGraph(graphs2[1]);
  graphAxes2.addGraph(graphs2[2]);
  graphAxes2.addGraph(graphs2[3]);
  graphAxes2.addGraph(graphs2[4]);
  table1 = new Table(tableAxes1, [200, 400, 600, 800, 1000], [1], graphs1);
  table2 = new Table(tableAxes2, [200, 400, 600, 800, 1000], [0.5], graphs2);
  let tmp = setGraphs();
  table1.setGoal([tmp[0]]);
  table2.setGoal([tmp[1]]);
  
  button = createButton("start");
  signal1Button = createButton("start");
  signal2Button = createButton("start");
  
  button.mousePressed(toggle);
  signal1Button.mousePressed(toggle1);
  signal2Button.mousePressed(toggle2);
  button.position(270, 320);
  signal1Button.position(270, 50);
  signal2Button.position(270, 160);
  textAlign(CENTER);
}

function draw() {
  background('white');
  tint(255, 50);
  image(bg, 0, 0, width, height);
  noTint();
//   if(win) {
    
//     text("YOU WON. CLICK TO PLAY AGAIN.", width / 2, height / 2 - 100);
//   }
  tableAxes1.drawAxes();
  tableAxes2.drawAxes();
  graphAxes1.drawAxes();
  graphAxes2.drawAxes();
  sumAxes.drawAxes();
  // goalAxes.drawAxes();
  
  graphAxes1.drawSumGraph(2.5, [51, 99, 100]);
  graphAxes2.drawSumGraph(2.5, [51, 99, 100]);
  sumAxes.drawGraph(goalGraph);
  sumAxes.drawSumGraph(2.5, [51, 99, 100]);
  table1.display();
  table2.display();
}

function setGraphs() {
  if (graphMade == 0) { 
    for (let i = 0; i < 5; i++) {
      table1.graphs[i].setMultiplier(0);
      table2.graphs[i].setMultiplier(0);
    }
    colorMode(RGB);
    goalGraph = new Graph((x) => (sin(1 * x) + 0.5 * sin(3 * x)), 0.05, color(255, 0, 0), 2);
    colorMode(HSB);
    graphMade += 1;
    return [0, 2];
  }
  for (let i = 0; i < 5; i++) {
    table1.graphs[i].setMultiplier(0);
    table2.graphs[i].setMultiplier(0);
  }
  for (let i = 0; i < 5; i++) {
    table1.oscillators[i].amp(0);
    table2.oscillators[i].amp(0);
  }
  rand1 = random([1, 2, 3, 4, 5]);
  rand2 = (rand1 - 1 + random([1, 2, 3, 4])) % 5 + 1;
  colorMode(RGB);
  goalGraph = new Graph((x) => (sin(rand1 * x) + 0.5 * sin(rand2 * x)), 0.05, color(255, 0, 0), 2);
  colorMode(HSB);
  return [rand1 - 1, rand2 - 1];
}


function mousePressed() {
  // console.log(win);
  // if(win) {
  //   win = false;
  //   let tmp = setGraphs();
  //   table1.setGoal([tmp[0]]);
  //   table2.setGoal([tmp[1]]);
  //   return;
  // }
  let tmp1 = table2.mouseClicked(isPlaying2 || isPlaying);
  let tmp2 = table1.mouseClicked(isPlaying1 || isPlaying);
}

function toggle() {
  if(isPlaying) {
    table1.pause();
    table2.pause();
    button.html("start");
    signal1Button.html("start");
    signal1Button.html("start");
    
    isPlaying = false;
    isPlaying1 = false;
    isPlaying2 = false;
  }
  else {
    table1.play();
    table2.play();
    button.html("stop");
    signal1Button.html("start");
    signal2Button.html("start");
    isPlaying = true;
    isPlaying1 = false;
    isPlaying2 = false;
  }
}

function toggle1(){
  if(isPlaying1) {
    table1.pause();
    table2.pause();
    button.html("start");
    signal1Button.html("start");
    signal1Button.html("start");
    
    isPlaying = false;
    isPlaying1 = false;
    isPlaying2 = false;
  }
  else {
    table1.play();
    table2.pause();
    button.html("start");
    signal1Button.html("stop");
    signal2Button.html("start");
    isPlaying = false;
    isPlaying1 = true;
    isPlaying2 = false;
  }
}
function toggle2(){
  if(isPlaying2) {
    table1.pause();
    table2.pause();
    button.html("start");
    signal1Button.html("start");
    signal2Button.html("start");
    isPlaying = false;
    isPlaying1 = false;
    isPlaying2 = false;
  }
  else {
    table2.play();
    table1.pause();
    button.html("start");
    signal2Button.html("stop");
    signal1Button.html("start");
    isPlaying = false;
    isPlaying2 = true;
    isPlaying1 = false;
  }
}