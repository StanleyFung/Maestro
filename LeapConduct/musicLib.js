var SONG_ID = "songs"

function playbackAdjuster() {
    this.adjustSpeed = function (factor) {
        console.log("Adjusting Speed by " + factor);
        var song = document.getElementById(SONG_ID);
        song.playbackRate = factor;
        console.log("Current playback speed " + song.playbackRate)
    }

    this.adjustVolume = function (factor) {
        console.log("Adjusting Volume by " + factor);
        var song = document.getElementById(SONG_ID);
        song.volume = factor + song.volume;
        console.log("Current playback speed " + song.volume)
    }

    this.pausePlayBack = function (){
        var song = document.getElementById(SONG_ID);
        song.pause();
    }

    this.stopPlayBack = function (){
        var song = document.getElementById(SONG_ID);
        song.pause();
        song.src = '';
        song.currentTime = 0;
    }

    this.play = function (){
        var song = document.getElementById(SONG_ID);
        song.play();
    }
    this.play = function (src){
        var song = document.getElementById(SONG_ID);
        song.src = src;
    }
    this.getSongObject = function(){
        return document.getElementById(SONG_ID);
    }
}
