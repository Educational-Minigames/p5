var axes1, axes2, axes3;
var graph;
var graphs = [];
var table;
var pauseButton, randomAmpButton, resetButton;
var dt;
var bg;
function preload() {
  bg = loadImage('../../assets/background.jpeg');
}
function setup() {
  textFont("bkamran");
  pauseButton = createButton('پخش صدا');
  randomAmpButton = createButton('دامنه‌های تصادفی');
  resetButton = createButton('شروع دوباره');
  
  pauseButton.position(10, 475);
  randomAmpButton.position(120, 475);
  resetButton.position(245, 475);
  resetButton.mousePressed(reset);
  pauseButton.mousePressed(pause);
  randomAmpButton.mousePressed(randomAmplitude);
  axes1 = new Axes(375, 110, 395, 60, [4 * PI, 1], [2, 1]);
  axes2 = new Axes(375, 380, 395, 100, [4 * PI, 1], [4, 1]);
  axes3 = new Axes(30, 430, 270, 380, [1300, 1], [5, 1]);
  axes3.setIncludeNegative(false);
  table = new Table(axes3, [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
                    [1, 2, 4, 8], graphs);

  graphs.push(new Graph(x => 0.2 * sin(3 * x), 0.05, color(255, 50, 0), 1, 300, true));
  graphs.push(new Graph(x => 0.2 * sin(4 * x), 0.05, color(255, 100, 0), 1, 400, true));
  graphs.push(new Graph(x => 0.2 * sin(5 * x), 0.05, color(255, 150, 0), 1, 500, true));
  graphs.push(new Graph(x => 0.2 * sin(6 * x), 0.05, color(255, 200, 0), 1, 600, true));
  graphs.push(new Graph(x => 0.2 * sin(7 * x), 0.05, color(255, 250, 0), 1, 700, true));
  graphs.push(new Graph(x => 0.2 * sin(8 * x), 0.05, color(255, 0, 50), 1, 800, true));
  graphs.push(new Graph(x => 0.2 * sin(9 * x), 0.05, color(255, 0, 100), 1, 900, true));
  graphs.push(new Graph(x => 0.2 * sin(10 * x), 0.05, color(255, 0, 150), 1, 1000, true));
  graphs.push(new Graph(x => 0.2 * sin(11 * x), 0.05, color(255, 0, 200), 1, 1100, true));
  graphs.push(new Graph(x => 0.2 * sin(12 * x), 0.05, color(255, 0, 250), 1, 1200, true));
  
  
  for (var tmp of graphs) {
    tmp.setMultiplier(0);
    axes1.addGraph(tmp);  
    axes2.addGraph(tmp);
  }
  dt = 0.01;
  createCanvas(850, 500);
}

function draw() {
  image(bg, 0,0,width,height);
  axes1.drawAxes();
  axes2.drawAxes();
  noStroke();
  textSize(32);
  text("زمان", 800, 115);
  text("زمان", 800, 385);
  textSize(28);
  text("فرکانس", 340, 440);
  text("دامنه", 30, 35);
  text("حوزه فرکانس", 160, 35);
  
  text("حوزه زمان", 600, 35)
  // text("حوزه زمان", 40, 80);
  textSize(16);
  axes2.drawSumGraph(2, color(255, 100, 100));
  axes1.drawGraphs();
  axes1.pushGraphs(dt);
  table.display(); 

  // linedash(500, 20, 500, 480, 4);
}

function mousePressed() {
  table.mouseClicked();
}

function rgb(ratio) {
    //we want to normalize ratio so that it fits in to 6 regions
    //where each region is 256 units long
    let normalized = floor(ratio * 256 * 6);

    //find the distance to the start of the closest region
    let x = normalized % 256;

    let red = 0, grn = 0, blu = 0;
    switch(normalized / 256)
    {
    case 0: red = 255;      grn = x;        blu = 0;       break;//red
    case 1: red = 255 - x;  grn = 255;      blu = 0;       break;//yellow
    case 2: red = 0;        grn = 255;      blu = x;       break;//green
    case 3: red = 0;        grn = 255 - x;  blu = 255;     break;//cyan
    case 4: red = x;        grn = 0;        blu = 255;     break;//blue
    case 5: red = 255;      grn = 0;        blu = 255 - x; break;//magenta
    }

    return color(red, grn, blu);
}

function randomAmplitude() {
  for (var graph of table.graphs) {
    graph.setMultiplier(random(table.yNumbers));
  }
}

function pause() {
  for (var graph of graphs) {
    graph.pause();
  }
}

function reset() {
  for (var graph of graphs) {
    graph.setMultiplier(0);
  }
}