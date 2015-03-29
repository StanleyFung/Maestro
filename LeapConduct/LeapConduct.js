/**
 * Created by sfung on 2015-03-28.
 */

window.addEventListener('load', function () {

    var oldX = 0;
    var oldY = 0;
    var oldTime = 0;
    var isMovingRight = false
    var isMovingUp = false
    var PRECISION_DECIMAL = 3
    var movingLeft = false
    var movingRight = false
    var movingUp = false
    var movingDown = false

//Stage of conducting is int from 0 - 3
    var DOWN = 0
    var LEFT = 1
    var RIGHT = 2
    var UP = 3
    var stageOfConducting = UP

    window.output = $('#output');
    var bpmLabel = document.getElementById('bpm');
    var menu = document.getElementById('menu8');


    document.getElementById("mario").onclick = function () {
        pbAdj.changeSong("mario.mp3")
    }
    document.getElementById("zelda").onclick = function(){
      pbAdj.changeSong("Zelda.mp3")
    }
    document.getElementById("testsong").onclick = function(){
      pbAdj.changeSong("testsong.mp3")
    }
    document.getElementById("canond").onclick = function(){
      pbAdj.changeSong("CanonD.mp3")
    }
    document.getElementById("gangam").onclick = function(){
      pbAdj.changeSong("gangam.mp3")
    }

    var velocityThreshold = 55;

    var timeIntervals = [120, 120, 120, 120]
    var previousTime = 0;

    var songStarted = false;

    var pbAdj = new playbackAdjuster();
    pbAdj.initEqualizer()

    var equalizerChangeThreshold = 0.08;
    var negEqualizerChangeThreshhold = -1 * equalizerChangeThreshold;

//LEAP
    Leap.loop({

        hand: function (hand) {
            var currentTime = new Date().getTime();
            var screenPosition = hand.screenPosition(hand.palmPosition);
            var currentX = screenPosition[0].toPrecision(PRECISION_DECIMAL);
            var differenceX = currentX - oldX;

            var currentY = screenPosition[1].toPrecision(PRECISION_DECIMAL);
            var differenceY = currentY - oldY;

            if (Math.abs(differenceX) > velocityThreshold) {
                // console.log(differenceX)

                if (isMovingRight && differenceX < 0) {
                    // console.log("Changed Direction Left")
                    movingLeft = true
                    movingRight = false
                } else if (!isMovingRight && differenceX > 0) {
                    // console.log("Changed Direction Right")
                    movingRight = true
                    movingLeft = false
                }

                if (differenceX > 0) {
                    isMovingRight = true
                } else if (differenceX < 0) {
                    isMovingRight = false
                }
            }
            oldX = currentX;

            if (Math.abs(differenceY) > velocityThreshold) {

                if (isMovingUp && differenceY < 0) {
                    // console.log("Changed Direction Up")
                    movingUp = true
                    movingDown = false
                } else if (!isMovingUp && differenceY > 0) {
                    // console.log("Changed Direction Down")
                    movingUp = false
                    movingDown = true
                }

                if (differenceY > 0) {
                    isMovingUp = true

                } else if (differenceY < 0) {
                    isMovingUp = false
                }
            }
            oldY = currentY

            //Conducting Loop

            var oldValues = [];

            if (stageOfConducting == UP) {

                if (movingDown) {
                    stageOfConducting = DOWN
                    console.log("Moved to Down")

                    isMovingRight = false
                    isMovingUp = false

                    movingLeft = false
                    movingRight = false
                    movingUp = false
                    movingDown = false
                    oldX = 0;
                    oldY = 0;
                    timeIntervals[DOWN] = currentTime - previousTime
                    previousTime = currentTime
                }
            }
            else if (stageOfConducting == DOWN) {

                if (movingLeft) {
                    stageOfConducting += 1
                    console.log("Moved to Left")
                    timeIntervals[DOWN] = currentTime - previousTime
                    previousTime = currentTime
                    if (!songStarted) {
                        wavesurfer.play()
                        songStarted = true
                    }
                }
            } else if (stageOfConducting == LEFT) {
                if (movingRight) {
                    stageOfConducting += 1
                    console.log("Moved to Right")
                    timeIntervals[RIGHT] = currentTime - previousTime
                    previousTime = currentTime
                }
            } else if (stageOfConducting == RIGHT) {
                if (movingLeft && movingUp) {
                    stageOfConducting += 1
                    console.log("Moved to Up")
                    timeIntervals[UP] = currentTime - previousTime
                    previousTime = currentTime
                    //Update BPM
                    if (songStarted) {
                        var total = timeIntervals[DOWN] + timeIntervals[LEFT] + timeIntervals[RIGHT] + timeIntervals[UP];
                        var average = total / 4
                        var speed = 1000 / average * 60;
                        if (speed >= 60 && speed <= 300) {
                            oldValues.unshift(speed);
                            if (oldValues.length > 5) {
                                oldValues.pop();
                            }

                            var averageSpeed = 0;

                            for (var i = 0; i < oldValues.length; i++) {
                                averageSpeed += oldValues[i] / oldValues.length;
                            }

                            bpmLabel.innerHTML = "BPM: " + averageSpeed;
                            pbAdj.adjustSpeed(averageSpeed / songBPM);
                        }

                    }
                }
                oldTime = currentTime;
            }

        }
    }).use('screenPosition', {
        scale: 1
    }).use('playback', {
        recording: 'pinch-57fps.json.lz',
        requiredProtocolVersion: 6,
        pauseOnHand: true,
        loop: true
    })
        .use('riggedHand');

    window.controller = Leap.loopController;

//Myo
    var myoinput = document.getElementById('myoinput');
    var myo = Myo.create();

    var calibrateButton = document.getElementById("setZero");
    calibrateButton.onclick = function () {
        myo.zeroOrientation();
    }

    myo.on('fist', function (edge) {
        //Edge is true if it's the start of the pose, false if it's the end of the pose
        if (edge) {
            pbAdj.pausePlayBack()
        }
    });

    myo.on('fingers_spread', function () {
        pbAdj.play()
    })

    myo.on('imu', function (data) {
        var x = data.orientation.x.toPrecision(PRECISION_DECIMAL)
        var y = data.orientation.z.toPrecision(PRECISION_DECIMAL)
        var z = data.orientation.y.toPrecision(PRECISION_DECIMAL)
        myoinput.innerHTML = "Orientation-- X: " + x + " Y: " + y + " Z: " + z;

        if (y > 0.15) {
            document.getElementById("satb").innerHTML = "Bass";
        }
        else if (y < -0.15) {
            document.getElementById("satb").innerHTML = "Treble";
        }
        else {
            document.getElementById("satb").innerHTML = "Mid";
        }

        if (x < -0.12) {
            var equalizerChange = z * 20;
            if (y > 0.15) {
                if (z < negEqualizerChangeThreshhold || z > equalizerChangeThreshold) {
                    document.getElementById("height").innerHTML = z;
                    pbAdj.changeBass(equalizerChange);
                }
            }
            else if (y < -0.15) {
                if (z < negEqualizerChangeThreshhold || z > equalizerChangeThreshold) {
                    document.getElementById("height").innerHTML = z;
                    pbAdj.changeTrebel(equalizerChange);
                }
            }
            else {
                if (z < negEqualizerChangeThreshhold || z > equalizerChangeThreshold) {
                    document.getElementById("height").innerHTML = z;
                    pbAdj.changeMid(equalizerChange);
                }
            }
        }
    })

});
