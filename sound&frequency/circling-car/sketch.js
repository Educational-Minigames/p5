var freq_slider, amp_slider, osc, playing;
let bg;
var freq, amp, time, freq1;
//freq, amp and phase are from 0 to 1
function preload() {
  freq_slider = createSlider(0, 0.5,0.2, 0.1);
  amp_slider = createSlider(1, 5, 2, 0.8);
  bg = loadImage("../../assets/background.jpeg");
}
function setup() {
  time = 0;
  angleMode(DEGREES);
  frameRate(40);
  createCanvas(700, 400);
  
  setup_sliders(freq_slider, amp_slider);
  
  axes = new Axes(
    createVector(800 / 2 - 150, height / 2 + 80),
    't', 'amp', 7, 2);
  
}

function draw() {
  image(bg, 0, 0, width, height);
  write_text();
  if (freq_slider.value() / 5 != freq || 
    amp_slider.value() / 5 != amp) {
    
    freq = freq_slider.value() / 5;
    amp = amp_slider.value() / 5;
    // osc.freq(map(freq, 0, 1, 100, 500));
    freq1 = map(freq, 0, 1, 100, 500);
    // osc.amp(amp);
    time = 0;
  }
  axes.draw_graph(sine_maker(amp * 2, freq1/2, -freq1/2 * time), 0, time, 0.03);
  fill(255,255,255);
  circle(110, height / 2 + 80, amp * 200);
  strokeWeight(3);
  // line(110 - amp * 100, height / 2 + 80, 110 + amp * 100, height / 2 + 80);
  line(110, height / 2 + 80 + amp * 100, 110, height / 2 + 80 - amp * 100);
  // line(110, height / 2 + 80, 110 + amp * 100 * cos(freq1/2 * time), height / 2 + 80 + amp * 100 * sin(freq1/2 * time));
  linedash(110 - amp * 100, height / 2 + 80 + amp * 100 * sin(freq1/2 * time), 800 / 2 - 150, height / 2 + 80 + amp * 100 * sin(freq1/2 * time), 4, '.');
  // linedash(110 + amp * 100 * cos(freq1/2 * time), height / 2 + 80, 110 + amp * 100 * cos(freq1/2 * time), height / 2 + 80 + amp * 100 * sin(freq1/2 * time), 4, '.');
  
  fill(255, 0, 0);
  stroke(255, 0, 0);
  circle(110 + amp * 100 * cos(freq1/2 * time), height / 2 + 80 + amp * 100 * sin(freq1/2 * time), 10);
  stroke(0,0,255);
  fill(0,0,255);
  // circle(110 + amp * 100 * cos(freq1/2 * time), height / 2 + 80 , 5);
  stroke(255,0,0);
  fill(255,0,0);
  circle(110 + amp, height / 2 + 80 + amp * 100 * sin(freq1/2 * time), 5);
  circle(800 / 2 - 150, height / 2 + 80 + amp * 100 * sin(freq1/2 * time), 5);
  stroke(0,0,0);  
  // noFill();
  noFill();
  time += 0.1;
}

class Axes{
  constructor(origin, x_label, y_label, x_count, y_count) {
    this.origin = origin;
    this.x_label = x_label;
    this.y_label = y_label;
    this.x_count = x_count;
    this.y_count = y_count;
    this.spacing = 50;
  }
  draw_graph(func, start, end, dx) {
    this.draw_axes();
    this.draw_tips();
    if (start > end) return;
    else if (start < 0) start = 0;
    else if (end > this.x_count) end = this.x_count;
    let x = start;
    while(x < end) {
      my_line(this.c2p(x, func(x)), this.c2p(x + dx, func(x + dx)));
      x += dx;
    }
  }
  
  c2p(X, Y) {
    return createVector(this.origin.x + X * this.spacing,
                       this.origin.y - Y * this.spacing)
  }
  draw_axes() {
    strokeWeight(4);
    line(this.origin.x, 
         this.origin.y,  
         this.origin.x + this.x_count * this.spacing, 
         this.origin.y);
    
    line(this.origin.x, 
         this.origin.y + this.y_count * this.spacing, 
         this.origin.x, 
         this.origin.y - this.y_count * this.spacing);

  }
  draw_tips() {
    triangle(this.origin.x + this.x_count * this.spacing, this.origin.y + 3, this.origin.x + this.x_count * this.spacing, this.origin.y - 3, this.origin.x + this.x_count * this.spacing + 8, this.origin.y);
    triangle(this.origin.x + 3, this.origin.y - this.y_count * this.spacing, 
             this.origin.x - 3, this.origin.y - this.y_count * this.spacing,
             this.origin.x, this.origin.y - this.y_count * this.spacing - 8);
     
  }
}

function my_line(v1, v2) {
  line(v1.x, v1.y, v2.x, v2.y);
}

function sine_maker(a, f, p) {
  return x => a * sin(f * x + p);
}

function setup_sliders(freq_slider, amp_slider) {
  freq_slider.position(10, 10);
  amp_slider.position(10, 50);
}

function write_text() {
  textFont("bkamran");
  textSize(32);
  // noStroke();
  // noFill();
  fill(0,0,0);
  strokeWeight(1);
  text("سرعت ماشین", 160, 28);
  text("شعاع دایره", 160, 68);
  text("زمان", 620, height / 2 + 85);
  
  // stroke(0,0,0);
}

function linedash(x1, y1, x2, y2, delta, style = '-') {
  // delta is both the length of a dash, the distance between 2 dots/dashes, and the diameter of a round
  let distance = dist(x1,y1,x2,y2);
  let dashNumber = distance/delta;
  let xDelta = (x2-x1)/dashNumber;
  let yDelta = (y2-y1)/dashNumber;

  for (let i = 0; i < dashNumber; i+= 2) {
    let xi1 = i*xDelta + x1;
    let yi1 = i*yDelta + y1;
    let xi2 = (i+1)*xDelta + x1;
    let yi2 = (i+1)*yDelta + y1;

    if (style == '-') { line(xi1, yi1, xi2, yi2); }
    else if (style == '.') { point(xi1, yi1); }
    else if (style == 'o') { ellipse(xi1, yi1, delta/2); }
  }
}