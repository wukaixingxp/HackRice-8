
var GRAVITY = - 0.6;
var player;
var platforms = [];
var points;
var bg;
var buttonPressed = false;
var gameOver = false;
var img;
var img2;
var score = 0;
var song;

var AudioContext, context, gain, source, analyserNode, freqByteData;

function setup(){

    createCanvas(400,600);
    img = loadImage("images/logo.png");
    img2 = loadImage("images/doodleenemy.png");
    bg = loadImage("images/backdrop2.jpg");
    intro = loadImage('images/intro.png')
    button = createButton("Let's Jump");
    button.mousePressed(play);
    button.addClass("button");
    song = loadSound("sounds/gameover.wav");

}

function entryInfo(){
  if(gameOver){
      image(img,50,100,300,100);
      textAlign(CENTER);
      textSize(35);
      noStroke();
          fill("#ccffff");
          text("Good Game!", width / 2, height / 2);
      textAlign(CENTER);
      textSize(30);
      noStroke();
      fill('#ffffff');
      text(`Score : ${score}`,width / 2 , height / 2 +35)
      button = createButton("Jump Again");
      button.mousePressed(play);
      button.addClass("button");
    }else{
      image(img, 50, 100, 300, 100);
      image(intro, 30, 10, 350, 80);
}
}

function play(){
  createCanvas(400,600);
  bg = loadImage("images/background.png");
  player = new Doodler(width/2,height/2,false);
  platforms = generatePlatforms();
  points = 0;
  frameRate(30);
  buttonPressed=true;
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(audioSetup);
}

var audioSetup = function(stream) {
//	var AudioContext = window.AudioContext || window.webkitAudioContext;
//    
//	var context = new AudioContext();
//	var compressor = context.createDynamicsCompressor();
//	var gain = context.createGain();
//	var source = context.createMediaStreamSource(stream);
//	var processor = context.createScriptProcessor();
	
//	AudioContext = window.AudioContext || window.webkitAudioContext;
    
	context = new AudioContext();
//	compressor = context.createDynamicsCompressor();
	gain = context.createGain();
	source = context.createMediaStreamSource(stream);
//	processor = context.createScriptProcessor();
	analyserNode = context.createAnalyser();
    analyserNode.fftSize = 256;
    
	source.connect(gain);
    gain.connect(analyserNode);

//	compressor.connect(gain);
//	gain.connect(context.destination);
	
//	source.connect(processor);
//	processor.connect(context.destination);
	
	freqByteData = new Float32Array(analyserNode.frequencyBinCount);
	analyserNode.getFloatFrequencyData(freqByteData);
	analyserNode.maxDecibels = 0;
	
//	var isInSilence = function(){
//	    return compressor.reduction.value >= -50;
//	}
	
//	while (true) {
//		var tries = 0;
//		var checker = function() {
//		    tries = isInSilence() ? tries + 1 : 0;
//		    if(tries == 1) {
//		    	player.jump();
//		    	console.log("heard sound!");
//		    }
//		    setTimeout(checker, 1000);
//		}
//	
//		checker();
//	}
	
//	processor.onaudioprocess = function(e) {
//	//  console.log(e.inputBuffer);
//		player.jump();
//	  console.log("heard sound!");
//	};
	

};

var voice = new Wad({source : 'mic' }); // At this point, your browser will ask for permission to access your microphone.
var tuner = new Wad.Poly();
tuner.setVolume(0); // If you're not using headphones, you can eliminate microphone feedback by muting the output from the tuner.
tuner.add(voice);

voice.play(); // You must give your browser permission to access your microphone before calling play().

tuner.updatePitch();

var logPitch = function(){
    // console.log(tuner.pitch, tuner.noteName)
    requestAnimationFrame(logPitch)
};
logPitch();




function audioCheck() {

    // If you sing into your microphone, your pitch will be logged to the console in real time.

    analyserNode.getFloatFrequencyData(freqByteData);
    var sum = 0;
    for (var i = 0; i < freqByteData.length; i++) {
        sum += freqByteData[i];
    }
    var voiceLevel = sum / freqByteData.length;

    // console.log("level: " + voiceLevel);

    if (voiceLevel > -90) {
        if (tuner.pitch < 220) {
            player.applyForce(-1, 0);
        }
        else {
            player.applyForce(1,0);
        }
    }
	// If you sing into your microphone, your pitch will be logged to the console in real time.

	 // Stop calculating the pitch if you don't need to know it anymore.
	
	
}

function draw(){
  if (buttonPressed){
    background(bg);
    handlePlatforms();
    handlePlayer();
    drawScore();
    handleKeys();
  }else{
  background(bg);
  entryInfo();
  }
}


/**
 * updates, draws, and applies GRAVITY to player
 * checks if the player falls
 */
function handlePlayer() {
	player.update();
  player.draw();
  if (player.maxA + player.loc.y < -height / 2) {
    endGame();
  FBInstant
  .getLeaderboardAsync('Lunatic Jump Leaderboard')
  .then(leaderboard => {
    console.log(leaderboard.getName());
    return leaderboard.setScoreAsync(Math.round(player.maxA + points - 300));
  })
  .then(() => console.log('Score saved'))
  .catch(error => console.error(error));
  
  FBInstant
  .getLeaderboardAsync('Lunatic Jump Leaderboard')
  .then(leaderboard => leaderboard.getPlayerEntryAsync())
  .then(entry => {
    console.log(
      entries[i].getRank() + '. ' +
      entries[i].getPlayer().getName() + ': ' +
      entries[i].getScore()
    );
  })
  
  FBInstant
  .getLeaderboardAsync('Lunatic Jump Leaderboard')
  .then(leaderboard => {
    console.log(leaderboard.getName());
    return leaderboard.setScoreAsync(Math.round(player.maxA + points - 300));
  })
  
  FBInstant.updateAsync({
	  action: 'LEADERBOARD',
	  name: 'Lunatic Jump Leaderboard'
	})
	  .then(() => console.log('Update Posted'))
  }
}

/**
 * checks collision, draws, and manages all platforms
 */
function handlePlatforms() {
	if (analyserNode != null) {
    	audioCheck();
    }
  for (var i = platforms.length - 1; i >= 0; i--) {
		// loop through platforms backward
    if (platforms[i].onScreen) {
      platforms[i].draw(player.loc.y);
			if (platforms[i] instanceof Doodler)
				platforms[i].update(); // update Doodlers
      if (platforms[i].collidesWith(player)) {
        player.jump();
        console.clear();
        if (platforms[i] instanceof Doodler) {
					// it's not a platform, but a doodler!
          points += 100;
          platforms.splice(i, 1); // remove from array
        }
      }
    } else {

      /* no longer on-screen, delete previous platforms */
      platforms.splice(i, 1);
			/* push new platform */
      var x = noise(player.maxA, frameCount) * width;
      var y = player.maxA + height;
      if (random() < 0.9) {
				// 90% chance of being a regular platform
        platforms.push(new Platform(x, y));
      } else {
        if (random() > 0.5) {
					// 5% chance of being a doodler
					platforms.push(new Doodler(x, y, true));
				}
				// 5% chance of not regenerating
      }
    }
  }
}

/**
 * initializes platforms
 */
function generatePlatforms() {

	var field = []; // returning array
  var x_arr = [];
  var y_arr =  [];
	for (var y = 0; y < height * 2; y += 40) {
		// loop through Y

    for (var i = 0; i < 3; i++) { // attempt 3 new platforms
      var x = noise(i, y) * width;
      while (x_arr.includes(x)){
        x = noise(i, y) * width;
      }

      if (noise(y, i) > 0.5){ // 50% chance of a new platform
        field.push(new Platform(x, y));
      }
        x_arr <<  x ;

    }
  }

	return field;
}
/**
 * moves player based upon user input
 */
function handleKeys() {

  if (keyIsDown(LEFT_ARROW)) {

    player.applyForce(-1, 0);
  } else if (keyIsDown(RIGHT_ARROW)) {

    player.applyForce(1, 0);
  }
}




/**
 * draws the score
 */
function drawScore() {

    textSize(20);
    textAlign(LEFT);
    fill("#ccffff");
    noStroke();
    score = (player.maxA + points - 300).toFixed(0);
    text(`Score : ${(player.maxA + points - 300).toFixed(0)}`,10,25);
}




/**
 * ends loop, draws game over message
 */
function endGame() {
	gameOver = true ;
  buttonPressed = false;
  song.play();
}