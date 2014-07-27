
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
                    background.play();
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