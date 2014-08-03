
// TODO: fix rewind
herman.namespace('audio.AudioPlayer', function() {
    "use strict";
    
    /**
     * influenced by cocos2d SimpleAudioEngine
     */
    var AudioPlayer = (function() {

        /**
         * background music instance
         */
        var background = null;

        /**
         * sound effects storage
         */
        var effects = {};

        /**
         * effect id counter, used to store effects
         */
        var effectID = 0;

        /**
         * global effects volume
         */
        var effectVolume = 1;

        /**
         * preloaded sound files
         */
        var storage = {};

        return {

        // ------------------------
        // BACKGROUND MUSIC
        // ------------------------
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
        
        // ------------------------
        // SOUND EFFECTS
        // ------------------------
            effects : {

                play : function(file, loop) {
                    effects[effectID] = new herman.audio.Sound(file, loop, effectVolume);
                    return effectID;
                },

                getVolume : function() {
                    return effectVolume;
                },

                setVolume : function(volume) {
                    effectVolume = volume;
                    Object.keys(effects).forEach(function(effect) {
                        effect.volume(effectVolume);
                    });
                },

                pause : function(id) {
                    effects[effectID] && effects[effectID].pause();
                },

                pauseAll : function() {
                    Object.keys(effects).forEach(function(effect) {
                        effect.pause();
                    });
                },

                resume : function(id) {
                    effects[effectID] && effects[effectID].resume();
                },

                resumeAll : function() {
                    Object.keys(effects).forEach(function(effect) {
                        effect.resume();
                    });
                },

                stop : function(id) {
                    effects[effectID] && effects[effectID].stop();
                },

                stopAll : function() {
                    Object.keys(effects).forEach(function(effect) {
                        effect.stop();
                    });
                }

            },

        // ------------------------
        // PRELOADER
        // ------------------------
            preloader : {

                preload : function(manifest, callback) {
                    var counter = 0;
                    manifest.forEach(function(file) {
                        var request = new XMLHttpRequest();
                        request.open('GET', file, true);
                        request.responseType = 'arraybuffer';
                        request.onload = function(e) {
                            storage[file] = request.repspone;
                            counter++;
                            if (counter === manifest.length) {
                                callback && callback();
                            }
                        };
                        request.onerror = function(e) {
                            console.warn('Unable to load ' + file);    
                        };
                        request.send();    
                    });
                }  
            }            
        };

    })();


// expose
    return AudioPlayer;

});