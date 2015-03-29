var SONG_ID = "songs"

var wavesurfer = Object.create(WaveSurfer);
var equalizerRefactor;
var songs = {}
songs['Zelda.mp3'] = 100
songs['testsong.mp3'] = 140
songs['mario.mp3'] = 100
songs['CanonD.mp3'] = 60
songs['goodNight.mp3'] = 128
songs['gangam.mp3'] = 128
songs['smackThat.mp3'] = 120

var currentSongName = 'mario.mp3'
var songBPM = songs[currentSongName];

function playbackAdjuster() {
    
    this.changeSong = function(song){
      console.log("Changing to " + song);
      pbAdj = new playbackAdjuster(song);
      wavesurfer.load(song);
      currentSongName = song;
      songBPM = songs[song];
    }

    this.initEqualizer = function(){
        wavesurfer.init({
        container: document.querySelector('#waveform'),
        waveColor: '#f15c00',
        progressColor: '#003300'
    });

    // Load audio from URL
    wavesurfer.load(currentSongName);

    // Equalizer
    wavesurfer.on('ready', function () {
        var EQ = [
            {
                f: 32,
                type: 'lowshelf'
            }, {
                f: 64,
                type: 'peaking'
            }, {
                f: 125,
                type: 'peaking'
            }, {
                f: 250,
                type: 'peaking'
            }, {
                f: 500,
                type: 'peaking'
            }, {
                f: 1000,
                type: 'peaking'
            }, {
                f: 2000,
                type: 'peaking'
            }, {
                f: 4000,
                type: 'peaking'
            }, {
                f: 8000,
                type: 'peaking'
            }, {
                f: 16000,
                type: 'highshelf'
            }];

        // Create filters
        var filters = EQ.map(function (band) {
            var filter = wavesurfer.backend.ac.createBiquadFilter();
            filter.type = band.type;
            filter.gain.value = 0;
            filter.Q.value = 1;
            filter.frequency.value = band.f;
            return filter;
        });

        // Connect filters to wavesurfer
        wavesurfer.backend.setFilters(filters);

        // Bind filters to vertical range sliders
        equalizerRefactor = document.querySelector('#equalizer');
        filters.forEach(function (filter) {
            var input = document.createElement('input');
            wavesurfer.util.extend(input, {
                type: 'range',
                min: -300,
                max: 300,
                value: 0,
                title: filter.frequency.value
            });

            input.style.display = 'inline-block';

            //input.style.visibility = 'hidden';
            input.setAttribute('orient', 'vertical');
            wavesurfer.drawer.style(input, {
                'webkitAppearance': 'slider-vertical',
                width: '25px',
                height: '150px'
            });
            equalizerRefactor.appendChild(input);

            var onChange = function (e) {
                filter.gain.value = ~~e.target.value/10;
            };

            input.addEventListener('input', onChange);
            input.addEventListener('change', onChange);
        });

        // For debugging
        wavesurfer.filters = filters;
    });

    // Log errors
    wavesurfer.on('error', function (msg) {
        console.log(msg);
    });

    // Bind play/pause button
    document.querySelector(
        '[data-action="play"]'
    ).addEventListener('click', wavesurfer.playPause.bind(wavesurfer));
    }
  
    this.adjustSpeed = function (factor) {
        //console.log("Adjusting Speed by " + factor);
        wavesurfer.setPlaybackRate(factor);
        //console.log("Current playback speed " + wavesurfer.backend.playbackRate)
    }

    this.adjustVolume = function (factor) {
        //console.log("Adjusting Volume by " + factor);
        wavesurfer.backend.setVolume(factor + wavesurfer.backend.getVolume())
        //console.log("Current playback speed " + wavesurfer.backend.getVolume())
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
    //this.play = function (src){
    //    var song = document.getElementById(SONG_ID);
    //    song.src = src;
    //    song.play();
    //}

    this.getSongObject = function(){
        return document.getElementById(SONG_ID);
    }

    this.updateSlider  = function(num, increment){
        var currentValue = parseFloat(equalizerRefactor.children[num].value);
        currentValue += increment;
        equalizerRefactor.children[num].value = currentValue
        var event = new Event('change');
        equalizerRefactor.children[num].dispatchEvent(event)
    }

    this.changeBass = function(increment){
        this.updateSlider(0,increment*0.8);
        this.updateSlider(1,increment);
        this.updateSlider(2,increment*0.8);
    }

    this.changeMid = function(increment){
        this.updateSlider(3,increment*0.8);
        this.updateSlider(4,increment);
        this.updateSlider(5,increment*0.8);
    }
    this.changeTrebel = function(increment){
        this.updateSlider(6, increment*0.8);
        this.updateSlider(7, increment);
        this.updateSlider(8, increment*0.8);
        this.updateSlider(9, increment*0.8*0.8);
    }
}
