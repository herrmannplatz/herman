// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
        };
})();

(function(window) {

    /**
     * @module herman
     * @type {[type]}
     */
    var herman = window.herman = {};    

    /**
     * @property {Number} VERSION herman version
     */
    herman.VERSION = 0;

    /**
     * create namespace
     * @method namespace
     * @param  {string} namespace 
     */
    herman.namespace = function(namespace, func) {
        var ns = namespace.split('.'); // 'canvas.Node'
        var module = ns.pop(); // 'Node'
        var o = herman; 

        if(ns[0] === 'herman') {
            ns.shift();
        }

        for(var i = 0; i < ns.length; i++){
            o = o[ns[i]] = o[ns[i]] || {};
        } 
        o[module] = func.call(this);
    };

    /**
     * prototypical inheritance helper
     * @param  {Object} child  
     * @param  {Object} parent
     * @return {Object}        
     */
    herman.inherits = function inherits(child, parent) {
        var o = Object.create(parent.prototype);
        o.constructor = child;
        child.prototype = o;
        child.prototype.super = parent.prototype;
        return child.prototype;
    };

})(window);

// TODO: rewind
herman.namespace('audio.AudioPlayer', function() {
    "use strict";

// AudioPlayer 
    
    /**
     * influenced by cocos2d SimpleAudioEngine
     */
    var AudioPlayer = (function() {

        var background;

        return {

        // background music
            background : {

                play : function(file, loop) {
                    if(background) {
                        background.stop();
                        background = null;
                    }
                    background = new herman.audio.Sound(file, loop);
                },

                stop : function() {
                    background.stop();
                },

                pause : function() {
                    background.pause();
                },

                resume : function() {
                    background.resume();
                },

                rewind : function() {
                    background.play(0);
                },

                willPlay : function() {
                    // body...
                },

                isPlaying : function() {
                    background.isPlaying();
                },    

                getVolume : function() {
                    return background.getVolume();
                },

                setVolume : function(volume) {
                    background.setVolume();
                }
            },

        // Effects 
            playEffect : function(file, loop, volume) {

            },

            getEffectsVolume : function() {
                // body...
            },

            setEffectsVolume : function(volume) {
                // body...
            },

            pauseEffect : function(id) {
                // body...
            },

            pauseAllEffects : function() {
                // body...
            },

            resumeEffect : function(id) {
                // body...
            },

            resumeAllEffects : function() {
                // body...
            },

            stopEffect : function(id) {
                // body...
            },

            stopAllEffects : function() {
                // body...
            }

        };

    })();


// expose
    return AudioPlayer;

});
/**
 * TODO: supported files
 * TODO: better checks
 * TODO: cross browser implementations
 */
herman.namespace('audio.Sound', function() {
    "use strict";

    // audio playback handled by WebAudio
    var WebAudioSound = function() {

        var context = new (window.AudioContext || window.webkitAudioContext)();

        // unlock ios 
        window.addEventListener('touchstart', function() {
            var buffer = context.createBuffer(1, 1, 22050);
            var source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start = source.start || source.noteOn;
            source.start(0);
        }, false);

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

        Sound.prototype._createSource = function(buffer) {
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
        };

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
            this.stop();

            var info = this._createSource(this.buffer);
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

        return Sound;
    };

    // audio playback handles by HTML5 Audio Tag 
    var HTML5TagSound = function() {
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
        Sound = WebAudioSound();        
    }
    catch(e) {
        console.warn('Web Audio API is not supported in this browser');
        Sound = HTML5TagSound();
    }
    return Sound;

});