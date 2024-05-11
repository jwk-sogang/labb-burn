

var fireElemLenght  = 6;
var elemOpacity     = 255;

var fireLines   = [];
var fireWidth   = 0;
var fireHeight  = 0;

var nbColors    = 255;  // Nb Colors in the palette
var palette     = [];   // our color palette for the fire

function setup() {
  
  colorMode(RGB);
  createCanvas(800, 600);
  
  // 2D Fire: init size of fire
  fireWidth   = int(width / fireElemLenght);
  fireHeight  = int(height / fireElemLenght);
  print(fireWidth + ", " + fireHeight);
  
  // for each fire's 'lines'
  for(var i= 0; i<fireHeight; i++)
  {
    fireLines[i] = [];      // create the new line of fire pixels
    
    for(var x=0; x<fireWidth; x++)
      fireLines[i][x] = 0;  // Initialize to black
  }
  
  // generate fire colors palette
  initializePalette();
  
  // set black background
  background(0,0,0);
  noStroke();
}

function draw() {
  
    // We clean the background each time
    background(0,0,0);
  
    // We generate a new base fire line (to make it 'move')
    initFireLine();
  
    // Compute the whole fire pixels
    fireGrow();
  
    // Display the result
    drawFire();
}

// ======================================
// > Initialize Palette mehtod
// You can update this process to change the fire colors
// ======================================
function initializePalette() {
    var colorScale = map(mouseY, 0, height, 8, 10); // Adjust scale based on mouseY
  
    for (var i = 0; i < nbColors; i++) {
      var val = exp(i / colorScale) - 1;
      var red = map(val, 0, exp(6.5), 0, 255);
      var green = map(val, 0, exp(9), 0, 255);
      var blue = random(50);
  
      if (green > 254) { // check for colors range
        red = 255;
        green = 255;
        blue = 255;
      }
  
      if (red < 20 && green < 20) {
        red = green = blue = 0;
      }
  
      palette[i] = color(red, green, blue, elemOpacity);
    }
  }
  


// ======================================
// > initFireLine() method
// Make a new base fire line (randomly, to make the fire 'move' when it grows)
// Remark: Y axis is inverter on our screens ==> baseY = fireHeight-1
// ======================================
function initFireLine() {
    // Map mouseY to a suitable range for initial fire intensity
    var maxIntensity = map(mouseY, 200, height, nbColors, 0);
    var midIntensity = map(mouseY, 200, height, 100, 0);
  
    for (var x = 0; x < fireWidth; x++) {
      fireLines[fireHeight-1][x] = random(maxIntensity - 50, maxIntensity);
      fireLines[fireHeight-2][x] = random(maxIntensity - 100, maxIntensity);
      fireLines[fireHeight-3][x] = random(0, midIntensity);
    }
  }
  


// ======================================
// > fireGrow() method
// Compute the whole fire, line by line. Start after the base line
// We compute each pixel color from its neighbors (a kind of median)
// It gives a blurry effect
// ======================================
function fireGrow(){
 
 // for each fire line
 for(var y=fireHeight-2; y>=1; y--)
 {

  // compute new fire color line 
  // based on the bottom & top lines
   for(var x=1; x<fireWidth-1; x++)
   {
       // Get neighbors colors
       var c1 = fireLines[y+1][x];
       var c2 = fireLines[y][x-1];
       var c3 = fireLines[y][x+1];
       var c4 = fireLines[y-1][x];
       var c5 = fireLines[y][x];

       // We make a 'median' color
       var newCol = int((c1 + c2 + c3 + c4 + c5) / 5) - 1;
       fireLines[y - 1][x] = newCol;
   }
 }
}


// ======================================
// > drawFire() method
// Drawing pass - to draw the fire from its computed matrix
//
// ======================================

function drawFire() {
    var opacity = map(mouseY, 0, height, 100, 255); // More transparent near the top
  
    for (var y = fireHeight - 1; y > 0; y--) {
      for (var x = 0; x < fireWidth - 1; x++) {
        var idx = int(fireLines[y][x]);
  
        if (idx < 0) idx = 0;
        if (idx >= nbColors) idx = nbColors - 1;
  
        fill(red(palette[idx]), green(palette[idx]), blue(palette[idx]), opacity);
        rect(int(x * fireElemLenght - (fireElemLenght / 2)),
             int(y * fireElemLenght + (fireElemLenght / 2)),
             fireElemLenght * 2, 
             fireElemLenght * 2);
      }
    }
  }
   


