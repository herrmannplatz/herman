
herman.namespace('audio.Sound', function() {
    "use strict";

    var context;

    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();

        // unlock ios 
        window.addEventListener('touchstart', function() {
            var buffer = context.createBuffer(1, 1, 22050);
            var source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start = source.start || source.noteOn;
            source.start(0);
        }, false);
    }
    catch(e) {
        throw new Error('Web Audio API is not supported in this browser');
    }

    function createSource(buffer) {
        var source = context.createBufferSource();
        source.buffer = buffer;

        // attach gain node
        var gain = context.createGain();
        source.connect(gain);
        gain.connect(context.destination);

        // handle deprecated methods
        // Web Audio API Change Log: Tue Sep 25 12:56:14 2012 -0700
        source.start = source.start || source.noteOn;
        source.stop = source.stop || source.noteOff;

        return {
            source : source,
            gain : gain
        };
    }

    function Sound(file, loop, volume) {    
        var self = this;    
        this.gainNode = null;
        this.source = null;
        this.startOffset = 0;
        this.startTime = 0;

        this.loop = (loop != 'undefined') ? loop : false;
        this.volume = (volume != 'undefined') ? volume : 1;
        
        var request = new XMLHttpRequest();
        request.open('GET', file, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            context.decodeAudioData(request.response, 
                function(buffer) {
                    self.buffer = buffer;
                    self.play();
                }, 
                function(error) {
                    console.warn('Unable to play background music ' + file);
                });
        };
        request.send();
    }

    Sound.prototype.setVolume = function(volume) {
        if (this.gainNode) {
            this.gainNode.gain.value = volume;    
        }
    };

    Sound.prototype.setVolume = function(volume) {
        if (this.gainNode) {
            return this.gainNode.gain.value;    
        }
    };

    Sound.prototype.play = function(offset) {
        this.stop();

        var info = createSource(this.buffer);
        this.source = info.source;
        this.gainNode = info.gain;

        // apply sound settings
        this.source.loop = this.loop;
        this.gainNode.gain.value = this.volume;

        this.startTime = context.currentTime;
        this.source.start(0, offset || 0); 
    };

    Sound.prototype.pause = function() {
        this.stop();
        this.startOffset += context.currentTime - this.startTime;
    };

    Sound.prototype.resume = function() {
        this.play(this.startOffset % this.buffer.duration);
    };

    Sound.prototype.stop = function() {
        if (this.source) {
            this.source.stop(0);
        }
    };

    Sound.prototype.isPlaying = function() {
        if (this.source) {
            return this.source.playbackState === this.source.PLAYING_STATE;
        }
    };

// expose
    return Sound;

});