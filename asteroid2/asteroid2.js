var ship;
var temp1;
var temp2;
var asteroids;
var MARGIN = 40;
var bullets;
var sound1;
var sound2;
var sound3;
var gameOver;
var win;

function preload(){
  temp1 = loadImage("data/ship1.png");
  temp2 = loadImage("data/bullet.png");
  sound1 = loadSound("data/1.mp3");
  sound2 = loadSound("data/2.mp3");
  sound3 = loadSound("data/blip.wav");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  ship = createSprite(width/2, height/2);
  ship.addImage("normal", temp1);
  ship.addAnimation("thrust", "data/ship1.png", "data/ship4.png");
  ship.setCollider("circle", 0, 0, 145);
  //ship.debug = true;
  ship.scale = .35;
  ship.maxSpeed = 6;
  ship.friction = 0.02;
      
  asteroids = new Group();
  bullets = new Group();
    
  for (var i = 0; i < 10; i++){
    //var s = createSprite(random(0, width), random(0, height));
    //s.setSpeed(random(3, 5), random(0, 360));
    //asteroids.add(s);
    
    var px = random(0, width);
    var py = random(0, height);
    createAsteroid(3, px, py);
  }
  gameOver = false;
  win = false;
}

function draw() {
  background(0); 
  fill(255);
  textAlign(CENTER);  
  text("Controls: Arrow Keys + Spacebar", width/2, 20);
   
  for (var i = 0; i < allSprites.length; i++){
    var s = allSprites[i];
    if (s.position.x > width + MARGIN){
      s.position.x = - MARGIN;
    }
    if (s.position.x < - MARGIN){
      s.position.x = width + MARGIN;
    } 
    if (s.position.y > height + MARGIN){
      s.position.y = - MARGIN;
    }
    if (s.position.y < - MARGIN){
      s.position.y = height + MARGIN;  

    }
  }
  if (keyDown(LEFT_ARROW)){
    ship.rotation -= 4; 
  } 
  if (keyDown(RIGHT_ARROW)){
    ship.rotation +=4;
  }
  if (keyDown(UP_ARROW)){
    ship.changeAnimation("thrust");
    ship.addSpeed(0.2, ship.rotation - 90);
  }else{
    ship.changeAnimation("normal");
  } 
  if (keyDown(DOWN_ARROW)){
    ship.debug = true;
  }else{
    ship.debug = false;
  }
  
  if (keyWentDown(" ")){
    var b = createSprite(ship.position.x, ship.position.y);
    b.scale = 0.3;
    b.addImage(temp2);
    b.setSpeed(10 + ship.getSpeed(), ship.rotation - 90);
    b.life = 40;
    sound1.play();
    bullets.add(b);
  }
  if (gameOver == true){
    fill(255);
    text(CENTER);
    textSize(50);
    text("GAME OVER", width/2, height/2);
    sound1.play = false;
  }
  if (win == true){
    fill(255);
    text(CENTER);
    textSize(50);
    text("YOU WIN!", width/2, height/2);
  }
  
  asteroids.overlap(bullets, asteroidHit);
  
  drawSprites();
  ship.bounce(asteroids, shipCollideAsteroid);
}// end of draw

function createAsteroid(type, x, y){
  
  var a = createSprite(x, y);
  
  var img = loadImage("data/asteroid" + floor(random(1, 5)) + ".png");
  a.addImage(img);
  a.setSpeed(2.5 - (type/2), random(0, 360));
  a.rotationSpeed = random(-.5, .5);
  //a.debug = true;
  a.type = type;
  
  if (type == 3){
    a.scale = 0.7;
  }
  if (type == 2){
    a.scale = 0.4;
  }
  if (type == 1){
    a.scale = 0.2;
  }
  
  a.mass = 2 + a.scale;
  a.setCollider("circle", 0, 0, 80);
  asteroids.add(a);
}

function asteroidHit(asteroid, bullet){
  var newType = asteroid.type - 1;
  
  if (newType > 0){
    first = createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    second = createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  }
  sound3.play(); 
  bullet.remove();
  asteroid.remove();
  console.log(asteroids);
  if (asteroids == 0){
    win = true;
  }
}

function shipCollideAsteroid(){
  if (ship.debug == true){
    ship.bounce(asteroids);  //don't do anything
  }else{
    ship.remove();
    updateSprites(false);
    gameOver = true;
   }  
}