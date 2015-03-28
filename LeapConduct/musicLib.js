var SONG_ID = "songs"

function playbackAdjuster() {
    this.wavesurfer = Object.create(WaveSurfer);

    this.initEqualizer = function(){
        this.wavesurfer.init({
        container: document.querySelector('#waveform'),
        waveColor: '#A8DBA8',
        progressColor: '#3B8686'
    });

    // Load audio from URL
    this.wavesurfer.load('testsong.mp3');

    // Equalizer
    this.wavesurfer.on('ready', function () {
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
            }
        ];

        // Create filters
        var filters = EQ.map(function (band) {
            var filter = this.wavesurfer.backend.ac.createBiquadFilter();
            filter.type = band.type;
            filter.gain.value = 0;
            filter.Q.value = 1;
            filter.frequency.value = band.f;
            return filter;
        });

        // Connect filters to wavesurfer
        wavesurfer.backend.setFilters(filters);

        // Bind filters to vertical range sliders
        var container = document.querySelector('#equalizer');
        filters.forEach(function (filter) {
            var input = document.createElement('input');
            wavesurfer.util.extend(input, {
                type: 'range',
                min: -40,
                max: 40,
                value: 0,
                title: filter.frequency.value
            });
            input.style.visibility = 'hidden';
            input.setAttribute('orient', 'vertical');
            wavesurfer.drawer.style(input, {
                'webkitAppearance': 'slider-vertical',
                width: '50px',
                height: '150px'
            });
            container.appendChild(input);

            var onChange = function (e) {
                filter.gain.value = ~~e.target.value;
            };

            input.addEventListener('input', onChange);
            input.addEventListener('change', onChange);
        });

        // For debugging
        wavesurfer.filters = filters;
    });

    // Log errors
    this.wavesurfer.on('error', function (msg) {
        console.log(msg);
    });

    // Bind play/pause button
    document.querySelector(
        '[data-action="play"]'
    ).addEventListener('click', this.wavesurfer.playPause.bind(this.wavesurfer));
    }
  
    this.adjustSpeed = function (factor) {
        console.log("Adjusting Speed by " + factor);
        var song = document.getElementById(SONG_ID);
        wavesurfer.setPlaybackRate(this.wavesurfer.getPlaybackRate() * factor);
        song.playbackRate = factor;
        console.log("Current playback speed " + song.playbackRate)
    }

    this.adjustVolume = function (factor) {
        console.log("Adjusting Volume by " + factor);
        var song = document.getElementById(SONG_ID);
        song.volume = factor + song.volume;
        this.wavesurfer.setVolume(factor + this.wavesurfer.getVolume())
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
        song.play();
    }
    this.getSongObject = function(){
        return document.getElementById(SONG_ID);
    }
    this.initEqualizer()

}
