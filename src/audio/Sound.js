/**
 * TODO: supported files
 * TODO: better checks
 * TODO: cross browser implementations
 * TODO: remove Protoype?
 */
herman.namespace('audio.Sound', function() {
    "use strict";

    // audio playback handled by WebAudio
    var useWebAudioSound = function() {

        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();

        // unlock ios 
        window.addEventListener('touchstart', function() {
            var buffer = context.createBuffer(1, 1, 22050);
            var source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start = source.start || source.noteOn;
            source.start(0);
        }, false);

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

            this.loop   = (typeof loop === 'undefined') ? false : loop;
            this.volume = (typeof volume === 'undefined') ? 1 : volume;
            
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

        Sound.prototype.getVolume = function() {
            if (this.gainNode) {
                return this.gainNode.gain.value;    
            }
        };

        Sound.prototype.play = function(offset) {
            if (this.source) {
                this.stop();

                var info = createSource(this.buffer);
                this.source = info.source;
                this.gainNode = info.gain;

                // apply sound settings
                this.source.loop = this.loop;
                this.gainNode.gain.value = this.volume;

                this.startTime = context.currentTime;
                this.source.start(0, offset || 0); 
            } 
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

        return Sound;
    };

    // audio playback handles by HTML5 Audio Tag 
    var useHTML5TagSound = function() {
        function Sound(file, loop, volume) {   
            this.loop   = (typeof loop === 'undefined') ? false : loop;
            this.volume = (typeof volume === 'undefined') ? 1 : volume;

            this.audio = document.createElement('audio');
            this.audio.src = file;
            this.audio.loop = this.loop;
            this.audio.volume = this.volume; 
            this.audio.play();
        }

        Sound.prototype.setVolume = function(volume) {
            this.audio.volume = volume;
        };

        Sound.prototype.getVolume = function() {
            return this.audio.volume;
        };

        Sound.prototype.play = function(offset) {
            this.audio.currentTime = offset || 0;
            this.audio.play();
        };

        Sound.prototype.pause = function() {
            this.audio.pause();
        };

        Sound.prototype.resume = function() {
            this.audio.play();
        };

        Sound.prototype.stop = function() {
            this.audio.pause();
            this.audio.currentTime = 0;
        };

        Sound.prototype.isPlaying = function() {
            return !this.audio.paused; 
        };

        return Sound;
    };    

// expose
    var Sound = null;
    try {
        Sound = useWebAudioSound();        
    }
    catch(e) {
        console.warn('Web Audio API is not supported in this browser');
        Sound = useHTML5TagSound();
    }
    return Sound;

});