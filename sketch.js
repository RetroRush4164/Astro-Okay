/*
 -> Created by RetroRush
 -> Astro-Okay
 -> Description: A simple space game where you control a ship to collect
    stars while avoiding asteroids. Use arrow keys to move your ship.
    use SPACE to activate boost when it's available.
 */

// Variables
let ship;
let asteroids = [];
let stars = [];
let score = 0;
let lives = 3;
let gameOver = false;
let boostTimer = 0;       
let boostCooldown = 0;    
let boostDuration = 4;    
let boostCooldownTime = 10; 



function setup() {
  createCanvas(windowWidth, windowHeight);
  // Default frame rate
  frameRate(90); 
  
  // Create ship
  ship = new Ship();
  
  // Create asteroids
  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(-100, -10);
    let size = random(windowWidth * 0.015, windowWidth * 0.03);
    let speed = random(1, 3);
    asteroids.push(new Asteroid(x, y, size, speed));
  }
  
  // Create stars 
  for (let i = 0; i < 3; i++) {
    createStar();
  }
}


function draw() {
  background(0);
  
  // Draw stars in background
  drawStarBackground();
  
  // Check if game is over
  if (gameOver) {
    showGameOver();
    return;
  }
  
  
  updateBoostTimers();
  
  // Show game information (Score, Life...)
  showInfo();
  
  // Update and show ship, astroid and star
  ship.update();
  ship.display();
  
  manageAsteroids();
  
  manageStars();
  
  // Check for level advancement
  if (score > 0 && score % 5 == 0) {
    addNewAsteroid();
    score++; 
  }
}


function updateBoostTimers() {
  // If boost is active decrease the time
  if (boostTimer > 0) {
    boostTimer -= 1/90; 
    
    // Return normal whrn timer expires
    if (boostTimer <= 0) {
      boostTimer = 0;
      frameRate(90);
      
      // Return to normal speed
      for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].speed /= 2; 
      }
      for (let i = 0; i < stars.length; i++) {
        stars[i].speed /= 2;       }
    }
  }
  
  // If it's cooldown, decrease the cooldown timer
  if (boostCooldown > 0) {
    boostCooldown -= 1/90; 
    if (boostCooldown < 0) {
      boostCooldown = 0;
    }
  }
}


function drawStarBackground() {
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    fill(255);
    ellipse(x, y, 1, 1);
  }
}


function manageAsteroids() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].update();
    asteroids[i].display();
    
    // Check for astroid collision 
    if (asteroids[i].hits(ship)) {
      lives--;
      if (lives <= 0) {
        gameOver = true;
      }
      // Reset 
      asteroids[i].y = random(-100, -10);
      asteroids[i].x = random(width);
    }
    
    //  reset it When it's out of screen
    if (asteroids[i].y > height) {
      asteroids[i].y = random(-100, -10);
      asteroids[i].x = random(width);
    }
  }
}


function manageStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].update();
    stars[i].display();
    
    // Check if star is collected
    if (stars[i].hits(ship)) {
      // 2x score during boost
      if (boostTimer > 0) {
        score += 2;  
      } 
      // Normal points when no boost
      else {
        score++;     
      }
      stars.splice(i, 1);
      createStar();
    }
    
    // If star goes out screen, remove it, make new one
    else if (stars[i].y > height) {
      stars.splice(i, 1);
      createStar();
    }
  }
}


function createStar() {
  let x = random(width);
  let y = random(-100, -10);
  let speed = random(1, 3);
  stars.push(new Star(x, y, speed));
}

// new asteroid when leveling up
function addNewAsteroid() {
  let x = random(width);
  let y = random(-100, -10);
  let size = random(windowWidth * 0.015, windowWidth * 0.03);
  let speed = random(1, 4);
  asteroids.push(new Asteroid(x, y, size, speed));
}


function activateBoost() {
  if (boostCooldown <= 0) {
    boostTimer = boostDuration;
    boostCooldown = boostCooldownTime;
    // Chnage frame to make game faster
    frameRate(120); 
    
    // 2x speed of all asteroids and stars
    for (let i = 0; i < asteroids.length; i++) {
      asteroids[i].speed *= 2; 
    }
    
   // 2x Speed during boost
    for (let i = 0; i < stars.length; i++) {
      stars[i].speed *= 2; 
    }
  }
}


function showInfo() {
  fill(255);
  textSize(16);
  textAlign(LEFT); 
  text("Score: " + score, 20, 30);
  text("Lives: " + lives, 20, 50);
  
  
  if (boostTimer > 0) {
    // Show active boost timer
    fill(255, 0, 0); 
    text("BOOST ACTIVE: " + boostTimer.toFixed(1) + "s", 20, 70);
    // Show score multiplier during boost
    text("SCORE MULTIPLIER: 2x", 20, 90);
  } else if (boostCooldown > 0) {
    // Show cooldown timer
    fill(255, 150, 0); 
    text("BOOST READY IN: " + boostCooldown.toFixed(1) + "s", 20, 70);
  } else {
    // Show boost is ready
    fill(0, 255, 0); 
    text("BOOST READY - PRESS SPACE", 20, 70);
  }
}

// Show game over screen
function showGameOver() {
  fill(255);
  textSize(32);
  textAlign(CENTER);
  textSize(30);
  fill(255,150,0)
  text("Astro-Okay", width/2, 180);
  textSize(26);
  fill(255,255,255)
  text("GAME OVER", width/2, height/2);
  textSize(21);
  text("Final Score: " + score, width/2, height/2 + 38);
  textSize(18);
  text("Click to restart", width/2, height/2 + 80);
  textSize(14);
  fill(200);
  text("Created by RetroRush", width/2, height - 10);
}

// Check if key presses
function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    ship.setDir(-1, 0);
  } else if (keyCode == RIGHT_ARROW) {
    ship.setDir(1, 0);
  } else if (keyCode == UP_ARROW) {
    ship.setDir(0, -1);
  } else if (keyCode == DOWN_ARROW) {
    ship.setDir(0, 1);
  } else if (keyCode == 32) { 
    activateBoost();
  }
}

// Check if key releases
function keyReleased() {
  if (keyCode == LEFT_ARROW && ship.xdir == -1) {
    ship.setDir(0, ship.ydir);
  } else if (keyCode == RIGHT_ARROW && ship.xdir == 1) {
    ship.setDir(0, ship.ydir);
  } else if (keyCode == UP_ARROW && ship.ydir == -1) {
    ship.setDir(ship.xdir, 0);
  } else if (keyCode == DOWN_ARROW && ship.ydir == 1) {
    ship.setDir(ship.xdir, 0);
  }
}

// Check for mouse clicks
function mousePressed() {
  if (gameOver) {
    // Reset game
    gameOver = false;
    score = 0;
    lives = 3;
    ship = new Ship();
    boostTimer = 0;
    boostCooldown = 0;
    frameRate(90); 
    
    // Text alignment 
    textAlign(LEFT);
    
    // Reset asteroids
    asteroids = [];
    for (let i = 0; i < 5; i++) {
      let x = random(width);
      let y = random(-100, -10);
      let size = random(windowWidth * 0.015, windowWidth * 0.03);
      let speed = random(1, 3); // Normal speed
      asteroids.push(new Asteroid(x, y, size, speed));
    }
    
    // Reset stars
    stars = [];
    for (let i = 0; i < 3; i++) {
      createStar();
    }
  }
}

// Ship class
class Ship {
  constructor() {
    this.x = width/2;
    this.y = height - 50;
    this.size = 30;
    this.xdir = 0;
    this.ydir = 0;
    this.speed = 5; 
  }
  
  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }
  
  update() {
    // Move the ship based on direction
    this.x += this.xdir * this.speed;
    this.y += this.ydir * this.speed;
    
    // Keep ship on screen
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
  
  display() {
    fill(0, 255, 0); 
    noStroke();
    
    // Draw ship as a triangle
    triangle(
      this.x, this.y - this.size/2,
      this.x - this.size/2, this.y + this.size/2,
      this.x + this.size/2, this.y + this.size/2
    );
    
    // Animate boost flame at bottom of ship 
    if (boostTimer > 0) {
      fill(255, 0, 0); 
      let flameSize = 20 + random(10);       
      // Add boost bottom of ship
      triangle(
        this.x, this.y + this.size/2 + flameSize,
        this.x - this.size/3, this.y + this.size/2,
        this.x + this.size/3, this.y + this.size/2
      );
    }
  }
}

// Asteroid class
class Asteroid {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }
  
  update() {
    // Move asteroid down
    this.y += this.speed;
  }
  
  display() {
    fill(150);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  // Check collision with ship
  hits(ship) {
    let distance = dist(this.x, this.y, ship.x, ship.y);
    if (distance < this.size/2 + ship.size/2) {
      return true;
    } else {
      return false;
    }
  }
}

// Star class
class Star {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.size = 15;
    this.speed = speed;
    this.brightness = 255;
  }
  
  update() {
    // Drop star down
    this.y += this.speed;
    
    // Make star blinking
    this.brightness = 150 + random(0, 105);
  }
  
  display() {
    fill(this.brightness, this.brightness, 0);
    noStroke();
    
    // Draw star on screen
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI * i / 5 - HALF_PI;
      let x1 = this.x + cos(angle) * this.size/2;
      let y1 = this.y + sin(angle) * this.size/2;
      vertex(x1, y1);
      
      angle += TWO_PI / 10;
      let x2 = this.x + cos(angle) * this.size/4;
      let y2 = this.y + sin(angle) * this.size/4;
      vertex(x2, y2);
    }
    endShape(CLOSE);
  }
  
  // Check collision with ship
  hits(ship) {
    let distance = dist(this.x, this.y, ship.x, ship.y);
    if (distance < this.size/2 + ship.size/2) {
      return true;
    } else {
      return false;
    }
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
