function playbackAdjuster() {
    this.adjustSpeed = function (factor) {
        console.log("Adjusting Speed by " + factor);
        var song = document.getElementById("songs");
        song.playbackRate = factor;
        console.log("Current playback speed " + song.playbackRate)
    }

    this.adjustVolume = function (factor) {
        console.log("Adjusting Volume by " + factor);
        var song = document.getElementById("songs");
        song.volume = factor + song.volume;
        console.log("Current playback speed " + song.volume)
    }
}
