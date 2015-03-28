/**
 * Created by sfung on 2015-03-28.
 */
$(document).ready(function () {
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
    var movingLeftLabel = document.getElementById('movingLeft');
    var movingRightLabel = document.getElementById('movingRight');
    var movingUpLabel = document.getElementById('movingUp');
    var movingDownLabel = document.getElementById('movingDown');
    var bpmLabel = document.getElementById('bpm');
    var songBPM = 140;

    var velocityThreshold = 55;

    var timeIntervals = [120, 120, 120, 120]
    var previousTime = 0;

    var songStarted = false;

    var pbAdj = new playbackAdjuster();

    //Myo
    var myoinput = document.getElementById('myoinput');

    var myo = Myo.create();
    myo.on('fist', function(edge){
        //Edge is true if it's the start of the pose, false if it's the end of the pose
        if(edge){
            //pbAdj.pausePlayBack()
        }
    });

    myo.on('fingers_spread', function(){
        //pbAdj.play()
    })

    myo.on('imu', function (data) {
        var x = data.orientation.x.toPrecision(PRECISION_DECIMAL)
        var y = data.orientation.y.toPrecision(PRECISION_DECIMAL)
        var z = data.orientation.z.toPrecision(PRECISION_DECIMAL)
        myoinput.innerHTML = "Orientation-- X: " + x + " Y: " + y + " Z: "+ z;
    })

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

            var outputContent = "x: " + (screenPosition[0].toPrecision(PRECISION_DECIMAL)) + 'px' +
                "        <br/>y: " + (screenPosition[1].toPrecision(PRECISION_DECIMAL)) + 'px' +
                "        <br/>z: " + (screenPosition[2].toPrecision(PRECISION_DECIMAL)) + 'px';


            output.html(outputContent);
            movingLeftLabel.innerHTML = "Moving Left: " + movingLeft;
            movingRightLabel.innerHTML = "Moving Right: " + movingRight;
            movingUpLabel.innerHTML = "Moving Up: " + movingUp;
            movingDownLabel.innerHTML = "Moving Down: " + movingDown;

            //Conducting Loop

            if (stageOfConducting == UP) {
                if (movingDown) {
                    songStarted = true
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
                        bpmLabel.innerHTML = "BPM: " + speed;
                        pbAdj.adjustSpeed(speed / songBPM);

                    }
                }
            }
            oldTime = currentTime;
        }
    })
        .use('screenPosition', {
            scale: 1
        });
})
