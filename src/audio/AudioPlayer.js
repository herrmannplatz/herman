import Sound from './Sound'

/**
* background music instance
*/
let background = null

/**
* sound effects storage
*/
let effects = {}

/**
* effect id counter, used to store effects
*/
let effectID = 0

/**
* global effects volume
*/
let effectVolume = 1

/**
 * influenced by cocos2d SimpleAudioEngine
 * TODO: fix rewind
 */
export default {

  background : {

    play : function(file, loop) {
        if(background) {
            background.stop()
            background = null
        }
        background = new Sound(file, loop)
    },

    stop : function() {
        background.stop()
    },

    pause : function() {
        background.pause()
    },

    resume : function() {
        background.resume()
    },

    rewind : function() {
        background.play(0);
    },

    willPlay : function() {
        // body...
    },

    isPlaying : function() {
        background.isPlaying()
    },

    getVolume : function() {
        return background.volume
    },

    setVolume : function(volume) {
        background.volume = value
    }
  },

  effects : {

    play : function(file, loop) {
        effects[effectID] = new Sound(file, loop, effectVolume)
        return effectID
    },

    getVolume : function() {
        return effectVolume
    },

    setVolume : function(volume) {
      effectVolume = volume
      Object.entries(effects).forEach((effect) => effect.volume(volume))
    },

    pause : function(id) {
        if (effects[effectID]) {
            effects[effectID].pause()
        }
    },

    pauseAll : function() {
      Object.entries(effects).forEach((effect) => effect.pause())
    },

    resume : function(id) {
        if (effects[effectID]) {
            effects[effectID].resume()
        }
    },

    resumeAll : function() {
        Object.entries(effects).forEach((effect) => effect.resume())
    },

    stop : function(id) {
      if (effects[effectID]) {
          effects[effectID].stop();
      }
    },

    stopAll : function() {
      Object.entries(effects).forEach((effect) => effect.stop())
    }

  },

  preloader : {

    preload : function(manifest) {
      return Promise.all(manifest.map((src) => new Sound(src)))
    }
  }

}
