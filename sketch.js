

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
function initializePalette()
{
  // generate our 255 color palette
  // try to change colors composing the fire
  for(var i=0; i<nbColors; i++)
  {
    var val   = exp(i/10) - 1;

    var red   = map(val, 0, exp(7.5), 0, 255);
    var green = map(val, 0, exp(10), 0, 255);
    var blue  = random(50);
    
    if(green > 254) // check for colors range
    {
      red   = 255;
      green = 255;
      blue  = 255;
    }
    
    // check/erase for 'noisy' blue pixels
    if(red < 20 && green < 20)
    {
      red = green = blue = 0;
    }

    // add new color
    palette[i]  = color(red, green, blue, elemOpacity);
  }
}


// ======================================
// > initFireLine() method
// Make a new base fire line (randomly, to make the fire 'move' when it grows)
// Remark: Y axis is inverter on our screens ==> baseY = fireHeight-1
// ======================================
function initFireLine()
{
  // generate fire base (1st line) color ('randomly')
  for(var x=0; x<fireWidth; x++)
  {
    fireLines[fireHeight-1][x] = random(0,nbColors);
    fireLines[fireHeight-2][x] = random(0,nbColors);
    fireLines[fireHeight-3][x] = random(0,100);
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
function drawFire(){

  // foreach fire lines
  for(var y=fireHeight-1; y>0; y--)
  {
    // foreach pixel in the line
    for(var x=0; x<fireWidth-1; x++)
    {
      // get current pixel color index
      var idx = int(fireLines[y][x]);

      // check for color index limits
      if(idx<0) idx = 0;
      if(idx >= nbColors) idx = nbColors-1;
      
      // apply current pixel color
      fill(palette[idx]); 

      // Draw a square representing the current fire's pixel
      rect(int(x * fireElemLenght - (fireElemLenght / 2)),
          int(y * fireElemLenght + (fireElemLenght / 2)),
          fireElemLenght * 2 , 
          fireElemLenght * 2);
    }

  }

}
