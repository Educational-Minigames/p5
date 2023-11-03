var freqSlider;
var ampSlider;
var graph;
var bg
var axes;
var pauseButton;
var isPlaying;
function preload() {
  bg = loadImage('../../assets/background.jpeg');
}
function setup() {
  textFont("bkamran");
  createCanvas(800, 400);
  isPlaying = true;
  pauseButton = createButton("pause/start");
  pauseButton.position(10, height - 40);
  
  graph = new Graph(x => sin(x), 0.00001, color(255, 0, 0), 2, true);
  axes = new Axes(10, 220, 725, 100, [0.02, 1], [1, 1]);
  freqSlider = createSlider(1, 24000, 1);
  freqSlider.style('width', '605px');
  freqSlider.position(10,20);
  ampSlider = createSlider(0, 1, 0, 0.1);
  ampSlider.position(10, 60);
  pauseButton.mousePressed(() => {
    if (isPlaying) {
      graph.osc.stop();
    }
    else graph.osc.start();
    isPlaying = !isPlaying;
  });
}

function draw() {
  image(bg, 0,0,width,height);
  textSize(32);
  noStroke();
  let logFreq = floor(log(freqSlider.value()) / 2.302585);
  text("فرکانس = "+ freqSlider.value(), 625, 35);
  text("دامنه = "+ ampSlider.value(), 150, 75);
  // textSize(20);
  text("زمان", 755, 225);
  // textSize(16);
  stroke(255,0,0);
  // textScale(logFreq);
  graph.setXMultiplier(freqSlider.value(), 1);
  graph.setYMultiplier(ampSlider.value());
  axes.drawAxes();
  axes.drawGraph(graph);
}

function textScale(n) {
  textAlign(CENTER);
  if(n == 0)
    text("1" + "s", 200, 380);  
  else {
    let ms = pow(10 , 4 - n);
    text(ms + "ms", 200, 380);
  }
  textAlign(LEFT);
  line(10, 360,380, 360);
  fill(255, 0, 0);
  triangle(10, 360, 15, 363, 15, 357);
  triangle(380, 360, 375, 363, 375, 357);
}

function toggle(isPlaying) {
  if(isPlaying) {
    osc.stop();
  }
  else osc.start();
}