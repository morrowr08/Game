var Game = Game || {};

Game = (function  (option) {

    var opt = {
        Difficulty : 6000,
        LevelDuration : 60,
        SecondsBeforeStart : 3,
        StartLevel : 1,
        MaxLevel : 10,
        CandyPoints: 20,
        CandiesOnScreen : 4,
        MaxStrikes : 3
    };


var timeOutput = $('#timer span');
var levelOutput = $('#level span');
var scoreOutput = $('#score span');
var score = 0;
levelOutput.text(opt.StartLevel);
scoreOutput.text(score);





    $.extend(opt, option);


    var init = function () {
        hookupEvents();
        createBasket();
        startGame();
    },

    hookupEvents = function (){
        $('#startGame').on('click', function(){
            $('#instructions').hide();
            $('#game').show();
            countdownTimer();
        });

    },

    createBasket = function(){
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
    },

    startGame = function(){
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
                duration: Math.random()*-2500 + opt.Difficulty,
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

        function setupCandies(){
            debugger;
            for (var i = 0; i < opt.CandiesOnScreen; ++i) {
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
            score += opt.CandyPoints;
            scoreOutput.text(score);
        }
        function decreaseScore(){
            score -= opt.CandyPoints;
            scoreOutput.text(score);
        }

        setupCandies();

        // Level functionality
        levelOutput.text(opt.StartLevel);
        function endLevel(){
            opt.StartLevel += 1;
            opt.Difficulty -= 500;
            levelStartTimer();
            levelOutput.text(opt.StartLevel);
            startGame();
        }       

        function endGame(){
            // end game if player has run out of time. 

            // end game if player has run out of lives

            // if player has run out of time but still has lives left, then 
            // increase level and difficulty
        }
    };






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
        countdownTimer.start(opt.LevelDuration * 1000);
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
            countdownTimer.start(opt.LevelDuration * 1000);
            // CANDY.isPlaying = true;
        }
    }


        // 3 second countdown timer before round(level) starts
    function countdownTimer(){
        $('#gameStartCountdown').show();
        // Countdown Timer
        $('#gameStartCountdown p').text(opt.SecondsBeforeStart);
        //1000 will run it every 1 second
        var gameStartCountdown = setInterval(startCountdown, 2000); 
        function startCountdown() {
              opt.SecondsBeforeStart --;
              if (opt.SecondsBeforeStart <= 0) {
                 clearInterval(startCountdown);
                 $('#gameStartCountdown').hide();
                 $('#playGame').show();
                 startGame();
                 TIMER.init();
              }
              //Do code for showing the number of seconds here
              $('#gameStartCountdown p').text(opt.SecondsBeforeStart);
        }
    }


    init();

})();