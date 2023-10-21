var numPad;
var osc1, osc2;
var xTexts, yTexts;
var amplitude;
var t;
var fft;
function setup() {
  // colorMode(HSB);
  angleMode(DEGREES);
  numPad = new Array(12);
  fft = new p5.FFT(0, 512);
  osc1 = new p5.Oscillator();
  osc2 = new p5.Oscillator();
  amplitude = new p5.Amplitude();
  textSize(15);
    //مثلا برای ستون‌های عمودی به ترتیب فرکانس‌های 697 و 770 و  852 و 941 در نظر گرفته شده و تو هر سطر افقی هم به ترتیب فرکانس‌های 1209 و 1336 و 1477 و 941 نظیر شده. [نمایش با فلش متحرک در سطر و ستون]
  
  for (let i = 0; i < numPad.length; i++) {
    numPad[i] = createButton(str(i + 1));
    numPad[i].position(60 + (i % 3) * 40,60 + floor(i / 3) * 40);//offSets
    numPad[i].size(30, 30); //size
  }
  numPad[9].style('font-size', 25 + 'px');
  numPad[9].html('*');
  numPad[10].html('0');
  numPad[11].html('#');
  
  numPad[0].mousePressed(() => {
    osc1.freq(1209);
    osc2.freq(697);
    playSound();
  });
  numPad[1].mousePressed(() => {
    osc1.freq(1336);
    osc2.freq(697);
    playSound();
  });
  numPad[2].mousePressed(() => {
    osc1.freq(1477);
    osc2.freq(697);
    playSound();
  });
  numPad[3].mousePressed(() => {
    osc1.freq(1209);
    osc2.freq(770);
    playSound();
  });
  numPad[4].mousePressed(() => {
    osc1.freq(1336);
    osc2.freq(770);
    playSound();
  });
  numPad[5].mousePressed(() => {
    osc1.freq(1477);
    osc2.freq(770);
    playSound();
  });
  numPad[6].mousePressed(() => {
    osc1.freq(1209);
    osc2.freq(852);
    playSound();
  });
  numPad[7].mousePressed(() => {
    osc1.freq(1336);
    osc2.freq(852);
    playSound();
  });
  numPad[8].mousePressed(() => {
    osc1.freq(1477);
    osc2.freq(852);
    playSound();
  });
  numPad[9].mousePressed(() => {
    osc1.freq(1209);
    osc2.freq(941);
    playSound();
  });
  numPad[10].mousePressed(() => {
    osc1.freq(1336);
    osc2.freq(941);
    playSound();
  });
  numPad[11].mousePressed(() => {
    osc1.freq(1477);
    osc2.freq(941);
    playSound();
  });
  
  
  createCanvas(210, 250);
}


function draw() {
  background(0);
  loadTexts();
  // var spectrum = fft.analyze();
  //console.log(spectrum);
  //stroke(255);
  // noStroke();
  // translate(width / 2 + 100, height / 2);
  //beginShape();
  // for (var i = 0; i < spectrum.length / 8; i++) {
    // var angle = map(i, 0, spectrum.length / 8, 0, 360);
    // var amp = spectrum[i];
    // var r = map(amp, 0, 256, 20, 100);
    //fill(i, 255, 255);
    // var x = r * cos(angle);
    // var y = r * sin(angle);
    // stroke(i * 8, 255, 255);
    // line(0, 0, x, y);
    //vertex(x, y);
    //var y = map(amp, 0, 256, height, 0);
    //rect(i * w, y, w - 2, height - y);
  // }
  //endShape();
}

function playSound() {
  env = new p5.Envelope(0.1, 0.9, 0.2, 0);
  osc1.start();
  env.play(osc1);
  osc2.start();
  env.play(osc2);
}

function loadTexts() {
  textFont("bkamran");
  noStroke();
  fill(255, 255, 255);
  textSize(22);
  for (let i = 0; i < 4; i++) {
    if(i == 0) t = '697';
    else if(i == 1) t = '770';
    else if(i == 2) t = '852';
    else if(i == 3) t = '941';
    // console.log(t);
    text(t,30, 80 + 40 * i);
  }
  for (let i = 0; i < 3; i++) {
    if(i == 0) t = '1209';
    else if(i == 1) t = '1336';
    else if(i == 2) t = '1477';
    text(t,61 + i * 40, 50);
  }
  
  
}