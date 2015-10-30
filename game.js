$(document).ready(function(){

var timeOutput = $('#timer span');
var levelOutput = $('#level span');
var scoreOutput = $('#score span');
var difficulty = 6000;
var time = 6;
var roundTimer = 3;
var level = 1;
var score = 0;
var points = 20;
levelOutput.text(level);
scoreOutput.text(score);
var position, width, height;

$('#startGame').on('click', function(){
	$('#instructions').hide();
	$('#game').show();
	levelStartTimer();
});

// 3 second countdown timer before round(level) starts
function levelStartTimer(){
	$('#gameStartCountdown').show();
	// Countdown Timer
	$('#gameStartCountdown p').text(roundTimer);
	//1000 will run it every 1 second
	var gameStartCountdown = setInterval(gameStartCountdown, 2000); 
	function gameStartCountdown() {
	  roundTimer --;
	  if (roundTimer <= 0) {
	     clearInterval(gameStartCountdown);
	     $('#gameStartCountdown').hide();
	     $('#playGame').show();
	     runGame();
	     TIMER.init();
	  }
	  //Do code for showing the number of seconds here
	  $('#gameStartCountdown p').text(roundTimer);
	}
}

// Starts running the game
function runGame(){

	Draggable.create(".basketFront", {
		type:"x",
		zIndexBoost: false,
		onDrag: function(){
			var $basket = $('#basket');
			var xy = $('.basketFront').css('transform').split(",")[4].replace(/\s*/, "");
			TweenLite.to($basket, 0, {css: { x: xy } });
		},
		bounds: document.getElementById("game"),
		onClick:function() {
			// Clicked basket
		},
		onDragEnd:function() {
			// Let go of dragging basket
		}
	});

	TIMER = {
		init: function () {
        countdownTimer = new Tock({
            countdown: true,
            interval: 50,
            callback: function () {
                //console.log(countdown.lap() / 1000);
                var counter = countdownTimer.timeToMS(countdownTimer.lap()) / 1000;

                if (counter <= 0) { // Fix so it will not past 0
                    timeOutput.text("0");
                    $('#timer').css({'color': '#FF0000'});
                }
                else {
                    timeOutput.text(counter.toFixed(0));
                }
            },
            complete: function () {
                countdownTimer.stop();
                countdownTimer.reset();
                // Show times up screen

            }
        });

        // Set first round to 60
        countdownTimer.start(time * 1000);
        // CANDY.isPlaying = true;

        },
        play: function () {
            countdownTimer.pause();
            // CANDY.isPlaying = true;
        },
        pause: function () {
            countdownTimer.pause();
            // CANDY.isPlaying = false;
        },
        reset: function () {
            countdownTimer.stop();
            countdownTimer.start(levelTime);
            // CANDY.isPlaying = true;
        }
	}

	// Round(level) Timer - 60 seconds
	// timeOutput.text(time);
	// //1000 will run it every 1 second
	// var timer = setInterval(timer, 1000); 

	// function timer() {
	//   time --;
	//   if(time < 1){
	//   	//counter ended, do something here
	//      $('#timer').css({'color': '#FF0000'});
	//      endLevel();
	//   }
	//   if (time < 0) {
	//      clearInterval(timer);
	//      return;
	//   }
	//   //Do code for showing the number of seconds here
	//   timeOutput.text(time);
	// }

	var candyType = [0,1,1,1,0,1,1,0];

	function getRandomInteger(min, max){
		return min + Math.floor(Math.random() * (max - min + 1));
	}

    function createCandy (){
    	var $candies = $('#playGame');
    	var $candyType = getRandomInteger(0, candyType.length - 1);
		var $candy = $('<div class="candy candy' + $candyType + '" data-candyid=' + $candyType + '></div>');
		$candy.css({
		'left': (Math.random() * $('#gameContainer').width() - $('.candy').width()) + 'px',
		'top': (- Math.random() * $('#gameContainer').height()) + 'px'
		});
		// add this candy to the set of candies
		$candies = $candies.append($candy);
        $candy.animate({
            top: "649px"
        }, {
        	duration: Math.random()*-2500 + difficulty,
        	step: function(){
            	hitTest($(this));
        	},
			complete: function(){
	        	hitTheFloor($(this));
	        }
        });
    }

    function hitTheFloor(candy){
		candy.stop()
    	candy.remove();
    	createCandy();
    }

    function hitBasket(candy){
    	// do some math
    	var index = parseInt(candy.attr('data-candyid'));
    	if(candyType[index]){
    		// good candy
    		// + score
    		increaseScore();
    		$('#plusPoints').fadeTo(200, 1, function(){
    			$(this).fadeOut(200);
    		});
    	} else {
    		// bad candy
    		// add strike
    		decreaseScore();
    		$('#minusPoints').fadeTo(200, 1, function(){
    			$(this).fadeOut(200);
    		});
    	}
    	// test win condition

		candy.stop();
    	candy.remove();
    	createCandy();
    }

    function startLevel(){
        var qt = 4;
        for (var i = 0; i < qt; ++i) {
			createCandy();
        }
    }

    function hitTest(candy){
    	var rect1 = toHitTestObj($('#basket'));
    	var rect2 = toHitTestObj(candy);
    	if (rect1.x < rect2.x + rect2.width &&
		   rect1.x + rect1.width > rect2.x &&
		   rect1.y < rect2.y + rect2.height &&
		   rect1.height + rect1.y > rect2.y) {
		   hitBasket(candy);
		}
    }

    function toHitTestObj(ele){
    	var pos = ele.offset();
    	return {
    		x: pos.left,
    		y: pos.top,
    		width: ele.width(),
    		height: ele.height()
    	}
    }

    function increaseScore(){
    	score += points;
    	scoreOutput.text(score);
    }
    function decreaseScore(){
    	score -= points;
    	scoreOutput.text(score);
    }

    startLevel();

	// Level functionality
	levelOutput.text(level);
	function endLevel(){
    	if(level == 1){
    		level += 1;
    		difficulty -= 500;
    		levelStartTimer();
    	} else if(level == 2){
    		level += 1;
    		difficulty -= 500;
    		levelStartTimer();
    	} else if(level == 3){
    		level += 1;
    		difficulty -= 500;
    		levelStartTimer();
    	} else if(level == 4){
    		level += 1;
    		difficulty -= 500;
    		levelStartTimer();
    	} else {
    		// endGame();
    	}
    	levelOutput.text(level);
    	runGame();
	}	    

	function endGame(){
		// end game if player has run out of time. 

		// end game if player has run out of lives

		// if player has run out of time but still has lives left, then 
		// increase level and difficulty
	}
}
});