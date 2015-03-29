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
    var status = document.getElementById('statuslabel');
    var eqLabelBass = document.getElementById('equalizerLabelBass');
    var eqLabelMid = document.getElementById('equalizerLabelMid');
    var eqLabelTreble = document.getElementById('equalizerLabelTreble');
    var menu = document.getElementById('menu8');


    document.getElementById("mario").onclick = function () {
        pbAdj.changeSong("mario.mp3")
    }
    document.getElementById("zelda").onclick = function(){
      pbAdj.changeSong("zelda.mp3")
    }
    document.getElementById("testsong").onclick = function(){
      pbAdj.changeSong("testsong.mp3")
    }
    document.getElementById("canond").onclick = function(){
      pbAdj.changeSong("CanonD.mp3")
    }
    document.getElementById("avicii").onclick = function(){
      pbAdj.changeSong("aviciithenights.mp3")
    }
        document.getElementById("smackThat").onclick = function(){
      pbAdj.changeSong("smackThat.mp3")
    }
    document.getElementById("goodNight").onclick = function(){
      pbAdj.changeSong("goodNight.mp3")
    }

    var velocityThreshold = 55;

    var timeIntervals = [120, 120, 120, 120]
    var previousTime = 0;

    var songStarted = false;

    var pbAdj = new playbackAdjuster();
    pbAdj.initEqualizer()

    var equalizerChangeThreshold = 0.06;
    var negEqualizerChangeThreshhold = -1 * equalizerChangeThreshold;
    var previousConductGestureTime = 0;

//LEAP
    Leap.loop({

        hand: function (hand) {
            var currentTime = new Date().getTime();
            var screenPosition = hand.screenPosition(hand.palmPosition);
            var currentX = screenPosition[0].toPrecision(PRECISION_DECIMAL);
            var differenceX = currentX - oldX;

            var currentY = screenPosition[1].toPrecision(PRECISION_DECIMAL);
            var differenceY = currentY - oldY;


            if(currentTime - previousConductGestureTime > 1500){
                console.log("Dun Goofed")
                stageOfConducting = UP;
                previousConductGestureTime = currentTime;
                status.style.fontSize = "50px"
                status.innerHTML = "DETECTING..."
            }


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
                    previousConductGestureTime = currentTime
                    stageOfConducting = DOWN
                    status.style.fontSize = "100px"
                    status.innerHTML = "DOWN"

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
                    previousConductGestureTime = currentTime

                    stageOfConducting += 1
                    status.style.fontSize = "100px"
                    status.innerHTML = "LEFT"
                    timeIntervals[DOWN] = currentTime - previousTime
                    previousTime = currentTime
                    if (!songStarted) {
                        wavesurfer.play()
                        songStarted = true
                    }
                }
            } else if (stageOfConducting == LEFT) {
                if (movingRight) {
                    previousConductGestureTime = currentTime

                    stageOfConducting += 1
                    status.style.fontSize = "100px"
                    status.innerHTML = "RIGHT"
                    timeIntervals[RIGHT] = currentTime - previousTime
                    previousTime = currentTime
                }
            } else if (stageOfConducting == RIGHT) {
                if (movingLeft && movingUp) {
                    previousConductGestureTime = currentTime

                    stageOfConducting += 1
                    status.style.fontSize = "100px"
                    status.innerHTML = "UP"
                    timeIntervals[UP] = currentTime - previousTime
                    previousTime = currentTime
                    //Update BPM
                    if (songStarted) {
                        var total = timeIntervals[DOWN] + timeIntervals[LEFT] + timeIntervals[RIGHT] + timeIntervals[UP];
                        var average = total / 4
                        var speed = 1000 / average * 60;
                        if (speed >= 60 && speed <= 200) {
                            oldValues.unshift(speed);
                            if (oldValues.length > 5) {
                                oldValues.pop();
                            }

                            var averageSpeed = 0;

                            for (var i = 0; i < oldValues.length; i++) {
                                averageSpeed += oldValues[i] / oldValues.length;
                            }
                            var finalSpeed = Math.round(averageSpeed)
                            bpmLabel.innerHTML = finalSpeed;
                            pbAdj.adjustSpeed(finalSpeed / songBPM);
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

        if (y > 0.15) {
            eqLabelBass.className='btn btn-default highlighted'
            eqLabelMid.className='btn btn-default'
            eqLabelTreble.className='btn btn-default'
        }
        else if (y < -0.15) {
            eqLabelBass.className='btn btn-default '
            eqLabelMid.className='btn btn-default'
            eqLabelTreble.className='btn btn-default highlighted'
        }
        else {
            eqLabelBass.className='btn btn-default'
            eqLabelMid.className='btn btn-default highlighted'
            eqLabelTreble.className='btn btn-default'
        }

        if (x < -0.12) {
            var equalizerChange = z * 20;
            if (y > 0.15) {
                if (z < negEqualizerChangeThreshhold || z > equalizerChangeThreshold) {
                    pbAdj.changeBass(equalizerChange);
                }
            }
            else if (y < -0.15) {
                if (z < negEqualizerChangeThreshhold || z > equalizerChangeThreshold) {
                    pbAdj.changeTrebel(equalizerChange);
                }
            }
            else {
                if (z < negEqualizerChangeThreshhold || z > equalizerChangeThreshold) {
                    pbAdj.changeMid(equalizerChange);
                }
            }
        }
    })

});
