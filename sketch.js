var mario, mario_running, ground, goundImage, backGround;
var backGroundImage, ground, groundImage;
var PLAY = 1,
  END = 0,
  gameState = PLAY;
var mario_collided, mario_collidedImage, f = 0;
var gameOver, gameOverImage, restart, restartImage;
var obstacle, obstacleImage1, obstacleImage2, obstacleImage3
var obstacleImage4, obstaclesGroup, bricksGroup;

var brick, brickImage, score = 0,
  framecount = 0;
var cloud, cloudImage, cloudsGroup, highestScore = 0;

var jumpSound, dieSound, checkpointSound;



//loading Images
function preload() {
  //mario animation
  mario_running = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");

  mario_collidedImage = loadAnimation("collided.png");



  // background image

  backGroundImage = loadImage("bg.png");
  groundImage = loadImage("ground2.png");

  ///obstacle Images
  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  obstacleImage3 = loadImage("obstacle3.png");
  obstacleImage4 = loadImage("obstacle4.png");

  ///brick Image
  brickImage = loadImage("brick.png");

  //cloud Image
  cloudImage = loadImage("cloud.png");

  ///gameover image
  gameOverImage = loadImage("gameOver.png");

  ///restart Image
  restartImage = loadImage("restart.png");

  //loading sounds
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3");

}


function setup() {
  createCanvas(600, 400);
  backGround = createSprite(width / 2, height / 2, 10, 20);
  backGround.addImage("backGround", backGroundImage);
  backGround.scale = 3;

  ground = createSprite(width / 2, 380, width, 10);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  mario = createSprite(30, height - 100, 10, 20);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collidedImage);
  mario.scale = 1.5;

  mario.setCollider("rectangle",0,0,mario.width,mario.height);
  mario.debug=true;
  
 // console.log("hi")
  console.log(backGround.width)

  //gameover sprite
  gameOver = createSprite(320, 150, 10, 10)
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  ///restart sprite

  restart = createSprite(320, 180, 10, 10)
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;


  //creating groups
  obstaclesGroup = new Group();
  bricksGroup = new Group();
  cloudsGroup = new Group();

}


function draw() {
  background("white");

  //gameState is play here
  if (gameState === PLAY) {

    ///velocity to mario

    if (keyDown("space") && mario.y>230) {
      mario.velocityY = -10;
      jumpSound.play();
    }

    //Gravity to mario
    mario.velocityY = mario.velocityY + 1;

    //scrolling of ground 

    ground.velocityX = -(8+3*Math.round(score/10));
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if (score % 10 === 0 && score > 0) {
      checkpointSound.play();
    }

    //scrolling of background 
    backGround.velocityX = -4;
    if (backGround.x < 0) {
      backGround.x = backGround.width / 2;
    }
    if (bricksGroup.isTouching(mario)) {
      for (var j = 0; j < bricksGroup.length; j++) {
        tempbrick = bricksGroup.get(j)
        bricksGroup.remove(bricksGroup.get(j))
        tempbrick.destroy();
        score++;
      }
    }


    if (mario.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
      mario.changeAnimation("collided", mario_collidedImage)
    }
  
    ///spawning obstacles
    spawnObstacles();

    ///spawning bricks
    spawnBricks();
    spawnclouds();
    
  }
  else  if (gameState === END) {
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      bricksGroup.setVelocityXEach(0);
      ground.velocityX = 0;
      backGround.velocityX = 0;
      obstaclesGroup.setLifetimeEach(-1);
      bricksGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      mario.velocityY = 0;
      restart.visible = true;
      gameOver.visible = true;
       if (score > 0 && score > highestScore) {
    highestScore = score;
  }
    
    
      if (mousePressedOver(restart)) {
        reset();
        console.log("hello")
      }
  }

    

  mario.collide(ground);
  drawSprites();
  fill(255)
  textSize(20);
  text("Score:- " + score, 170, 70)
  text("Highest Score:- " + highestScore, 300, 70)
 }


/// function to create obsctacles

function spawnObstacles() {
  if (frameCount % 80 === 0) {
    obstacle = createSprite(width / 2, height - 85, 10, 20);
   //var x=-(6+3*Math.round(score/10));
    //console.log(x)
    obstacle.velocityX = -(6+3*Math.round(score/10));
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacleImage1);
        break;
      case 2:
        obstacle.addImage(obstacleImage2);
        break;
      case 3:
        obstacle.addImage(obstacleImage3);
        break;
      case 4:
        obstacle.addImage(obstacleImage4);
        break;
      default:
        break;
    }
    // console.log(obstacle.width)
    obstacle.lifetime = 150;
    obstaclesGroup.add(obstacle);
  }
}


///function to create bricks

function spawnBricks() {
  if (frameCount % 60 === 0) {
    brick = createSprite(width, 250, 40, 10);
    brick.y = Math.round(random(150, 200));
    brick.addImage(brickImage);
    brick.velocityX = -5;
    brick.lifetime = 150;
    bricksGroup.add(brick);
  }
}

////function to spawnclouds

function spawnclouds() {
  if (frameCount % 100 === 0) {
    cloud = createSprite(width, 20, 40, 10);
    cloud.y = Math.round(random(20, 40));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -5;
    cloud.lifetime = 150;
    cloudsGroup.add(cloud);
    //cloud.depth=mario.depth;
    mario.depth += 4;
    // bricksGroup.add(brick);
  }
}

///function to reset the game
function reset() {
  gameState = PLAY;
  score = 0;
  restart.visible = false;
  gameOver.visible = false;
    cloudsGroup.destroyEach();
    bricksGroup.destroyEach();
    obstaclesGroup.destroyEach();
  mario.changeAnimation("running",mario_running);
}