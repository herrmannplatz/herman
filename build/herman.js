(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// TODO: fix rewind

/**
 * influenced by cocos2d SimpleAudioEngine
 */
'use strict';

var AudioPlayer = (function () {

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
        background: {

            play: function play(file, loop) {
                if (background) {
                    background.stop();
                    background = null;
                }
                background = new herman.audio.Sound(file, loop);
            },

            stop: function stop() {
                background.stop();
            },

            pause: function pause() {
                background.pause();
            },

            resume: function resume() {
                background.resume();
            },

            rewind: function rewind() {
                background.play(0);
            },

            willPlay: function willPlay() {
                // body...
            },

            isPlaying: function isPlaying() {
                background.isPlaying();
            },

            getVolume: function getVolume() {
                return background.getVolume();
            },

            setVolume: function setVolume(volume) {
                background.setVolume();
            }
        },

        // ------------------------
        // SOUND EFFECTS
        // ------------------------
        effects: {

            play: function play(file, loop) {
                effects[effectID] = new herman.audio.Sound(file, loop, effectVolume);
                return effectID;
            },

            getVolume: function getVolume() {
                return effectVolume;
            },

            setVolume: function setVolume(volume) {
                effectVolume = volume;
                Object.keys(effects).forEach(function (effect) {
                    effect.volume(effectVolume);
                });
            },

            pause: function pause(id) {
                if (effects[effectID]) {
                    effects[effectID].pause();
                }
            },

            pauseAll: function pauseAll() {
                Object.keys(effects).forEach(function (effect) {
                    effect.pause();
                });
            },

            resume: function resume(id) {
                if (effects[effectID]) {
                    effects[effectID].resume();
                }
            },

            resumeAll: function resumeAll() {
                Object.keys(effects).forEach(function (effect) {
                    effect.resume();
                });
            },

            stop: function stop(id) {
                if (effects[effectID]) {
                    effects[effectID].stop();
                }
            },

            stopAll: function stopAll() {
                Object.keys(effects).forEach(function (effect) {
                    effect.stop();
                });
            }

        },

        // ------------------------
        // PRELOADER
        // ------------------------
        preloader: {

            preload: function preload(manifest, callback) {
                var counter = 0;
                manifest.forEach(function (file) {
                    var request = new XMLHttpRequest();
                    request.open('GET', file, true);
                    request.responseType = 'arraybuffer';
                    request.onload = function (e) {
                        storage[file] = request.repspone;
                        counter++;
                        if (counter === manifest.length) {
                            if (callback) {
                                callback();
                            }
                        }
                    };
                    request.onerror = function (e) {
                        console.warn('Unable to load ' + file);
                    };
                    request.send();
                });
            }
        }
    };
})();

module.exports = AudioPlayer;

},{}],2:[function(require,module,exports){
/**
 * TODO: supported files
 * TODO: better checks
 * TODO: cross browser implementations
 * TODO: remove Protoype?
 */

// audio playback handled by WebAudio
'use strict';

var useWebAudioSound = function useWebAudioSound() {

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();

    // unlock ios
    window.addEventListener('touchstart', function () {
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
            source: source,
            gain: gain
        };
    }

    function Sound(file, loop, volume) {
        var self = this;
        this.gainNode = null;
        this.source = null;
        this.startOffset = 0;
        this.startTime = 0;

        this.loop = typeof loop === 'undefined' ? false : loop;
        this.volume = typeof volume === 'undefined' ? 1 : volume;

        var request = new XMLHttpRequest();
        request.open('GET', file, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            context.decodeAudioData(request.response, function (buffer) {
                self.buffer = buffer;
                self.play();
            }, function (error) {
                console.warn('Unable to play background music ' + file);
            });
        };
        request.send();
    }

    Sound.prototype.setVolume = function (volume) {
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }
    };

    Sound.prototype.getVolume = function () {
        if (this.gainNode) {
            return this.gainNode.gain.value;
        }
    };

    Sound.prototype.play = function (offset) {
        if (!this.source) {
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

    Sound.prototype.pause = function () {
        this.stop();
        this.startOffset += context.currentTime - this.startTime;
    };

    Sound.prototype.resume = function () {
        this.play(this.startOffset % this.buffer.duration);
    };

    Sound.prototype.stop = function () {
        if (this.source) {
            this.source.stop(0);
        }
    };

    Sound.prototype.isPlaying = function () {
        return this.source && this.source.playbackState === this.source.PLAYING_STATE;
    };

    return Sound;
};

// audio playback handles by HTML5 Audio Tag
var useHTML5TagSound = function useHTML5TagSound() {
    function Sound(file, loop, volume) {
        this.loop = typeof loop === 'undefined' ? false : loop;
        this.volume = typeof volume === 'undefined' ? 1 : volume;

        this.audio = document.createElement('audio');
        this.audio.src = file;
        this.audio.loop = this.loop;
        this.audio.volume = this.volume;
        this.audio.play();
    }

    Sound.prototype.setVolume = function (volume) {
        this.audio.volume = volume;
    };

    Sound.prototype.getVolume = function () {
        return this.audio.volume;
    };

    Sound.prototype.play = function (offset) {
        this.audio.currentTime = offset || 0;
        this.audio.play();
    };

    Sound.prototype.pause = function () {
        this.audio.pause();
    };

    Sound.prototype.resume = function () {
        this.audio.play();
    };

    Sound.prototype.stop = function () {
        this.audio.pause();
        this.audio.currentTime = 0;
    };

    Sound.prototype.isPlaying = function () {
        return !this.audio.paused;
    };

    return Sound;
};

// expose
var Sound = null;
try {
    Sound = useWebAudioSound();
} catch (e) {
    console.warn('Web Audio API is not supported in this browser');
    Sound = useHTML5TagSound();
}

module.exports = Sound;

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = require('../scene/Node');

var DomNode = (function (_Node) {
    _inherits(DomNode, _Node);

    /**
     * Dom Node
     * @param {HTMLDivElement} element
     */

    function DomNode(element) {
        _classCallCheck(this, DomNode);

        _get(Object.getPrototypeOf(DomNode.prototype), "constructor", this).call(this);
        if (!element) {
            // dev style
            this.element = document.createElement("div");
            this.element.className = "div-node";
            this.element.style.width = '100px';
            this.element.style.height = '100px';
            this.element.style.backgroundColor = 'white';
            this.element.style.border = '1px solid red';
        } else {
            this.element = element;
        }

        // force gpu rendering
        this.element.style.webkitPerspective = 1000;
        this.element.style.webkitBackfaceVisibility = "hidden";
        // node styles
        this.element.style.position = "absolute";
    }

    _createClass(DomNode, [{
        key: "update",
        value: function update() {

            // update and draw
            this.updateMatrix();
            this.draw();

            // udpate childs
            for (var i = 0, len = this.children.length; i < len; i++) {
                this.children[i].update();
            }
        }
    }, {
        key: "updateMatrix",
        value: function updateMatrix() {
            // build local matrix
            this.matrix.identity().transform(this.x + this.anchorX, this.y + this.anchorY, this.rotation, this.scale);

            // apply world matrix
            // TODO check preMultiply
            if (this.parent) {
                var world = this.parent.matrix.clone();
                this.matrix = world.multiply(this.matrix);
            }

            // TODO cross browser
            var matrixString = 'matrix(' + this.matrix.a11 + ',' + this.matrix.a21 + ',' + this.matrix.a12 + ',' + this.matrix.a22 + ',' + this.matrix.a13 + ',' + this.matrix.a23 + ')';
            this.element.style.webkitTransform = matrixString;
        }
    }, {
        key: "addChild",
        value: function addChild(child) {
            _get(Object.getPrototypeOf(DomNode.prototype), "addChild", this).apply(this, arguments);

            //TODO use stage reference
            this.updateMatrix();
            document.getElementById('domStage').appendChild(child.element);
        }
    }, {
        key: "removeChild",
        value: function removeChild(child) {
            _get(Object.getPrototypeOf(DomNode.prototype), "removeChild", this).apply(this, arguments);
            //TODO use stage reference
            document.getElementById('domStage').removeChild(child.element);
        }
    }]);

    return DomNode;
})(Node);

module.exports = DomNode;

},{"../scene/Node":9}],4:[function(require,module,exports){
'use strict';

var herman = window.herman = {};

require('./utils/polyfill');

herman.math = {};
herman.math.utils = require('./math/Vector');
herman.math.Vector = require('./math/Vector');
herman.math.Matrix = require('./math/Matrix');

herman.Node = require('./scene/Node');
herman.Sprite = require('./scene/Sprite');
herman.Text = require('./scene/Text');

herman.Renderer = require('./render/Renderer');

herman.audio = {};
herman.audio.AudioPlayer = require('./audio/AudioPlayer');
herman.audio.Sound = require('./audio/Sound');

herman.DomNode = require('./experimental/DomNode');

},{"./audio/AudioPlayer":1,"./audio/Sound":2,"./experimental/DomNode":3,"./math/Matrix":5,"./math/Vector":6,"./render/Renderer":8,"./scene/Node":9,"./scene/Sprite":10,"./scene/Text":11,"./utils/polyfill":13}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Utils = require('./utils.js');
/**
 * [PRECISION description]
 * @type {Number}
 */
var PRECISION = 15;

/**
 * [multiply description]
 *
 *                          | m2.a11 m2.a12 m2.a13 |
 *                          | m2.a21 m2.a22 m2.a23 |
 *                          | m2.a31 m2.a32 m2.a33 |
 * | m1.a11 m1.a12 m1.a13 |
 * | m1.a21 m1.a22 m1.a23 |
 * | m1.a31 m1.a32 m1.a33 |
 * 
 * @param  {[type]} m1 [description]
 * @param  {[type]} m2 [description]
 * @return {[type]}    [description]
 */
var _multiply = function _multiply(m1, m2) {
  var a11 = m1.a11;
  var a12 = m1.a12;
  var a21 = m1.a21;
  var a22 = m1.a22;

  m1.a11 = a11 * m2.a11 + a12 * m2.a21;
  m1.a12 = a11 * m2.a12 + a12 * m2.a22;
  m1.a13 = a11 * m2.a13 + a12 * m2.a23 + m1.a13;

  m1.a21 = a21 * m2.a11 + a22 * m2.a21;
  m1.a22 = a21 * m2.a12 + a22 * m2.a22;
  m1.a23 = a21 * m2.a13 + a22 * m2.a23 + m1.a23;
};

var Matrix = (function () {

  /**
   * 3x3 Matrix
   * @class Matrix
   * @constructor
   */

  function Matrix() {
    _classCallCheck(this, Matrix);

    //TODO param? (a,b,c,d,e,f) or (matrix), rename members
    this.identity();
  }

  /**
   * [translate description]
   * @param  {Number} tx
   * @param  {Number} ty
   * @return {Matrix}
   */

  _createClass(Matrix, [{
    key: 'translate',
    value: function translate(tx, ty) {
      this.a13 += tx;
      this.a23 += ty;
      return this;
    }

    /**
     * [rotate description]j
     * @param  {Number} angle radians
     * @method rotate
     * @return {Matrix}
     */
  }, {
    key: 'rotate',
    value: function rotate(angle) {
      angle = (angle * Utils.DEG_TO_RAD).toFixed(PRECISION); // or use radians?
      var sin = Math.sin(angle);
      var cos = Math.cos(angle);
      var a11 = this.a11;
      var a21 = this.a21;

      this.a11 = cos * a11 + sin * this.a12;
      this.a12 = -sin * a11 + cos * this.a12;
      this.a21 = cos * a21 + sin * this.a22;
      this.a22 = -sin * a21 + cos * this.a22;
      return this;
    }

    /**
     * [scale description]
     * @param  {Number} scale
     * @return {Matrix}
     */
  }, {
    key: 'scale',
    value: function scale(_scale) {
      this.a11 *= _scale;
      this.a12 *= _scale;
      this.a21 *= _scale;
      this.a22 *= _scale;
      return this;
    }

    /**
     * [transform description]
     */
  }, {
    key: 'transform',
    value: function transform(tx, ty, angle, scale) {
      return this.translate(tx, ty).rotate(angle).scale(scale);
    }

    /**
     * [multiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     */
  }, {
    key: 'multiply',
    value: function multiply(m) {
      _multiply(this, m);
      return this;
    }

    /**
     * [preMultiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     */
  }, {
    key: 'preMultiply',
    value: function preMultiply(m) {
      _multiply(m, this);
      return this;
    }

    /**
     * [invert description]
     *
     * | |a22 a23| |a13 a12| |a12 a13| |
     * | |a32 a33| |a33 a32| |a22 a23| |
     * |                               |    
     * | |a23 a21| |a11 a13| |a13 a11| |
     * | |a33 a31| |a31 a33| |a23 a21| |
     * |                               |
     * | |a21 a22| |a12 a11| |a11 a12| |
     * | |a31 a32| |a32 a31| |a21 a22| |
     *
     * @return {[type]} [description]
     */
  }, {
    key: 'inverse',
    value: function inverse() {
      //TODO: check determinant
      var invdet = 1 / this.determinant();
      var m = new Matrix();
      m.a11 = this.a22 * invdet;
      m.a12 = -this.a12 * invdet;
      m.a13 = (this.a12 * this.a23 - this.a22 * this.a13) * invdet;
      m.a21 = -this.a21 * invdet;
      m.a22 = this.a11 * invdet;
      m.a23 = (this.a13 * this.a21 - this.a23 * this.a11) * invdet;
      m.a31 = 0;
      m.a32 = 0;
      m.a33 = (this.a11 * this.a22 - this.a21 * this.a12) * invdet;
      return m;
    }

    /**
     * [determinant description]
     *
     * | a11 a12 a13 | a11 a12
     * | a21 a22 a23 | a21 a22
     * | a31 a32 a33 | a31 a32
     *
     * @return {Number}
     */
  }, {
    key: 'determinant',
    value: function determinant() {
      return this.a11 * this.a22 - this.a21 * this.a12;
    }

    /**
     * [identity description]
     * @return {Matrix} 
     */
  }, {
    key: 'identity',
    value: function identity() {
      this.a11 = this.a22 = this.a33 = 1;
      this.a12 = this.a13 = this.a21 = this.a23 = this.a31 = this.a32 = 0;
      return this;
    }

    /**
     * checks whether matrix is an identity matrix
     * @return {Boolean} 
     */
  }, {
    key: 'isIdentity',
    value: function isIdentity() {
      return this.a11 === 1 && this.a12 === 0 && this.a13 === 0 && this.a21 === 0 && this.a22 === 1 && this.a23 === 0;
    }

    /**
     * [decompose description]
     * @return {[type]} [description]
     */
  }, {
    key: 'decompose',
    value: function decompose() {
      var decomposed = {};
      decomposed.rotation = herman.math.Utils.RAD_TO_DEG * Math.atan2(this.a21, this.a11);
      return decomposed;
    }

    /**
     * clones matrix
     * @return {herman.math.Matrix}
     */
  }, {
    key: 'clone',
    value: function clone() {
      var m = new Matrix();
      m.a11 = this.a11;
      m.a12 = this.a12;
      m.a13 = this.a13;
      m.a21 = this.a21;
      m.a22 = this.a22;
      m.a23 = this.a23;
      return m;
    }

    /**
     * returns matrix as a nicely formatted string
     * @return {String}
     */
  }, {
    key: 'print',
    value: function print() {
      return 'matrix' + '\n' + this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' + this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + this.a31 + ' ' + this.a32 + ' ' + this.a33 + '\n';
    }
  }]);

  return Matrix;
})();

module.exports = Matrix;

},{"./utils.js":7}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector = (function () {

    /**
     * Vector
     * @class Vector
     * @constructor
     */

    function Vector(x, y) {
        _classCallCheck(this, Vector);

        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * [add description]
     * @param {[type]} vec [description]
     */

    _createClass(Vector, [{
        key: "add",
        value: function add(vec) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        }

        /**
         * [substract description]
         * @param  {[type]} vec [description]
         * @return {[type]}     [description]
         */
    }, {
        key: "substract",
        value: function substract(vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        }
    }, {
        key: "normalize",

        /**
         * [normalize description]
         * @return {[type]} [description]
         */
        value: function normalize() {
            var length = this.length();
            this.x /= length;
            this.y /= length;
            return this;
        }
    }, {
        key: "dot",

        /**
         * [dot description]
         * @param  {[type]} vec [description]
         * @return {[type]}     [description]
         */
        value: function dot(vec) {
            return this.x * vec.x + this.y * vec.y;
        }

        /**
         * [length description]
         * @return {[type]} [description]
         */
    }, {
        key: "length",
        value: function length() {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        }
    }]);

    return Vector;
})();

module.exports = Vector;

},{}],7:[function(require,module,exports){
"use strict";

module.exports = {

  /**
   * Degrees to radians
   */
  DEG_TO_RAD: Math.PI / 180,

  /**
   * Radians to degrees
   */
  RAD_TO_DEG: 180 / Math.PI,

  /**
   * [angleBetweenPoints description]
   * @param  {[type]} p1 [description]
   * @param  {[type]} p2 [description]
   * @return {[type]}    [description]
   */
  angleBetweenPoints: function angleBetweenPoints(p1, p2) {},

  /**
   * [intersect description]
   * @return {[type]} [description]
   */
  intersect: function intersect(l1, l2) {}

};

},{}],8:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = (function () {

    /**
     * TODO: init with config
     * @param {HTMLCanvasElement} canvas 
     */

    function Renderer(canvas) {
        _classCallCheck(this, Renderer);

        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        //this.context.webkitImageSmoothingEnabled = false;

        this.width = canvas.width;
        this.height = canvas.height;

        // this.canvas.width = this.width/2;
        // this.canvas.style.width = this.width + 'px';
        // this.canvas.height = this.height/2;
        // this.canvas.style.height = this.height + 'px';
    }

    /**
     * trigger node update
     */

    _createClass(Renderer, [{
        key: "update",
        value: function update(node) {
            // clear
            //this.canvas.width = this.canvas.width;
            //this.context.fillStyle = '#FFFFFF';
            //this.context.fillRect(0, 0, this.width, this.height);
            this.context.clearRect(0, 0, this.width, this.height);

            // draw into buffer
            node.update(this.context);
        }
    }]);

    return Renderer;
})();

module.exports = Renderer;

},{}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Vector = require('../math/Vector');
var Matrix = require('../math/Matrix');

var Node = (function () {

    /**
     * Node
     * 
     * @class Node
     * @constructor
     */

    function Node() {
        _classCallCheck(this, Node);

        /**
         * [tag description]
         * @type {[type]}
         */
        this.tag = undefined;

        /**
         * parent node
         * @type {[type]}
         */
        this.parent = undefined;

        /**
         * child nodes
         * @type {Array}
         */
        this.children = [];

        /**
         * world transform
         * @type {herman}
         */
        this.matrix = new Matrix();

        /**
         * [x description]
         * @type {Number}
         */
        this.x = 0;

        /**
         * [y description]
         * @type {Number}
         */
        this.y = 0;

        /**
         * [scale description]
         * @type {Number}
         */
        this.scale = 1;

        /**
         * [rotation description]
         * @type {Number}
         */
        this.rotation = 0;

        /**
         * [anchorX description]
         * @type {Number}
         */
        this.anchorX = 0;

        /**
         * [anchorY description]
         * @type {Number}
         */
        this.anchorY = 0;

        /**
         * [width description]
         * @type {Number}
         */
        this.width = 0;

        /**
         * [height description]
         * @type {Number}
         */
        this.height = 0;
    }

    /**
     * [update description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */

    _createClass(Node, [{
        key: 'update',
        value: function update(context) {

            // update and draw
            context.save();
            this.updateMatrix(context);
            this.draw(context);
            context.restore();

            // udpate childs
            for (var i = 0, len = this.children.length; i < len; i++) {
                this.children[i].update(context);
            }
        }

        /**
         * [draw description]
         * @return {[type]} [description]
         */
    }, {
        key: 'draw',
        value: function draw(context) {}
        // overwrite

        /**
         * update world matrix
         */

    }, {
        key: 'updateMatrix',
        value: function updateMatrix(context) {

            // build local matrix
            this.matrix.identity().transform(this.x + this.anchorX, this.y + this.anchorY, this.rotation, this.scale);

            // apply world matrix
            // TODO check preMultiply
            if (this.parent) {
                var world = this.parent.matrix.clone();
                this.matrix = world.multiply(this.matrix);
            }

            // update context transform
            context.setTransform(this.matrix.a11, this.matrix.a21, this.matrix.a12, this.matrix.a22, this.matrix.a13, this.matrix.a23);
        }

        /**
         * [localToGlobal description]
         * @param  {[type]} x [description]
         * @param  {[type]} y [description]
         * @return {[type]}   [description]
         */
    }, {
        key: 'localToGlobal',
        value: function localToGlobal(x, y) {
            var m = this.matrix.clone();
            m.translate(x, y);
            return new Vector(m.a13, m.a23);
        }

        /**
         * [globalToLocal description]
         * @param  {[type]} x [description]
         * @param  {[type]} y [description]
         * @return {[type]}   [description]
         */
    }, {
        key: 'globalToLocal',
        value: function globalToLocal(x, y) {
            // get mat, invert mat, append x,y
            var m = this.matrix.clone();
            return new Vector(x - m.a13, y - m.a23); // 600, 600 node 300, 300 -> 10, 10
        }

        /**
         * [addChild description]
         * @param {[type]} child [description]
         */
    }, {
        key: 'addChild',
        value: function addChild(child) {
            this.addChildAt(child, this.children.length);
        }

        /**
         * [addChildAt description]
         * @param {[type]} child [description]
         * @param {[type]} index [description]
         */
    }, {
        key: 'addChildAt',
        value: function addChildAt(child, index) {
            if (index < 0 || index > this.children.length) {
                throw new Error('index does not exist');
            }
            if (child && child.hasChild && !this.hasChild(child)) {
                if (child.parent) {
                    child.parent.removeChild(child);
                }
                this.children.splice(index, 0, child);
                child.parent = this;
            }
        }

        /**
         * [removeChild description]
         * @param  {[type]} child [description]
         * @return {[type]}       [description]
         */
    }, {
        key: 'removeChild',
        value: function removeChild(child) {
            if (this.hasChild(child)) {
                this.removeChildAt(this.children.indexOf(child));
            } else {
                throw new Error('object is not a child');
            }
        }

        /**
         * [removeChildAt description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
    }, {
        key: 'removeChildAt',
        value: function removeChildAt(index) {
            if (index < 0 || index >= this.children.length) {
                throw new Error('index does not exist');
            }
            this.children[index].parent = null;
            this.children.splice(index, 1);
        }

        /**
         * [hasChild description]
         * @param  {[type]}  child [description]
         * @return {Boolean}       [description]
         */
    }, {
        key: 'hasChild',
        value: function hasChild(child) {
            return this.children.indexOf(child) !== -1;
        }

        /**
         * [getChildren description]
         * @return {[type]} [description]
         */
    }, {
        key: 'getChildren',
        value: function getChildren() {
            return this.children;
        }

        /**
         * [getChildByTagName description]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
    }, {
        key: 'getChildByTagName',
        value: function getChildByTagName(name) {}
        // implement

        /**
         * [getChildAt description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */

    }, {
        key: 'getChildAt',
        value: function getChildAt(index) {
            if (index < 0 || index >= this.children.length) {
                throw new Error('index does not exist');
            }
            return this.children[index];
        }
    }]);

    return Node;
})();

module.exports = Node;

},{"../math/Matrix":5,"../math/Vector":6}],10:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = require('./node');

var Sprite = (function (_Node) {
    _inherits(Sprite, _Node);

    /**
     * Sprite
     * 
     * @class Sprite
     * @constructor
     */

    function Sprite(bitmap) {
        _classCallCheck(this, Sprite);

        _get(Object.getPrototypeOf(Sprite.prototype), 'constructor', this).call(this);
        this.bitmap = bitmap;
    }

    _createClass(Sprite, [{
        key: 'draw',
        value: function draw(context) {
            context.drawImage(this.bitmap, -this.bitmap.width / 2, -this.bitmap.height / 2);
        }
    }]);

    return Sprite;
})(Node);

module.exports = Sprite;

},{"./node":12}],11:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = require('./node');

var Text = (function (_Node) {
    _inherits(Text, _Node);

    /**
     * Text Node
     * @constructor
     */

    function Text(text) {
        _classCallCheck(this, Text);

        _get(Object.getPrototypeOf(Text.prototype), "constructor", this).call(this);
        this.text = text;
    }

    _createClass(Text, [{
        key: "draw",
        value: function draw(context) {
            context.fillStyle = "#00F";
            context.font = "italic 30pt Arial";
            context.fillText(this.text, 20, 50);
        }
    }]);

    return Text;
})(Node);

module.exports = Text;

},{"./node":12}],12:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Vector = require('../math/Vector');
var Matrix = require('../math/Matrix');

var Node = (function () {

    /**
     * Node
     * 
     * @class Node
     * @constructor
     */

    function Node() {
        _classCallCheck(this, Node);

        /**
         * [tag description]
         * @type {[type]}
         */
        this.tag = undefined;

        /**
         * parent node
         * @type {[type]}
         */
        this.parent = undefined;

        /**
         * child nodes
         * @type {Array}
         */
        this.children = [];

        /**
         * world transform
         * @type {herman}
         */
        this.matrix = new Matrix();

        /**
         * [x description]
         * @type {Number}
         */
        this.x = 0;

        /**
         * [y description]
         * @type {Number}
         */
        this.y = 0;

        /**
         * [scale description]
         * @type {Number}
         */
        this.scale = 1;

        /**
         * [rotation description]
         * @type {Number}
         */
        this.rotation = 0;

        /**
         * [anchorX description]
         * @type {Number}
         */
        this.anchorX = 0;

        /**
         * [anchorY description]
         * @type {Number}
         */
        this.anchorY = 0;

        /**
         * [width description]
         * @type {Number}
         */
        this.width = 0;

        /**
         * [height description]
         * @type {Number}
         */
        this.height = 0;
    }

    /**
     * [update description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */

    _createClass(Node, [{
        key: 'update',
        value: function update(context) {

            // update and draw
            context.save();
            this.updateMatrix(context);
            this.draw(context);
            context.restore();

            // udpate childs
            for (var i = 0, len = this.children.length; i < len; i++) {
                this.children[i].update(context);
            }
        }

        /**
         * [draw description]
         * @return {[type]} [description]
         */
    }, {
        key: 'draw',
        value: function draw(context) {}
        // overwrite

        /**
         * update world matrix
         */

    }, {
        key: 'updateMatrix',
        value: function updateMatrix(context) {

            // build local matrix
            this.matrix.identity().transform(this.x + this.anchorX, this.y + this.anchorY, this.rotation, this.scale);

            // apply world matrix
            // TODO check preMultiply
            if (this.parent) {
                var world = this.parent.matrix.clone();
                this.matrix = world.multiply(this.matrix);
            }

            // update context transform
            context.setTransform(this.matrix.a11, this.matrix.a21, this.matrix.a12, this.matrix.a22, this.matrix.a13, this.matrix.a23);
        }

        /**
         * [localToGlobal description]
         * @param  {[type]} x [description]
         * @param  {[type]} y [description]
         * @return {[type]}   [description]
         */
    }, {
        key: 'localToGlobal',
        value: function localToGlobal(x, y) {
            var m = this.matrix.clone();
            m.translate(x, y);
            return new Vector(m.a13, m.a23);
        }

        /**
         * [globalToLocal description]
         * @param  {[type]} x [description]
         * @param  {[type]} y [description]
         * @return {[type]}   [description]
         */
    }, {
        key: 'globalToLocal',
        value: function globalToLocal(x, y) {
            // get mat, invert mat, append x,y
            var m = this.matrix.clone();
            return new Vector(x - m.a13, y - m.a23); // 600, 600 node 300, 300 -> 10, 10
        }

        /**
         * [addChild description]
         * @param {[type]} child [description]
         */
    }, {
        key: 'addChild',
        value: function addChild(child) {
            this.addChildAt(child, this.children.length);
        }

        /**
         * [addChildAt description]
         * @param {[type]} child [description]
         * @param {[type]} index [description]
         */
    }, {
        key: 'addChildAt',
        value: function addChildAt(child, index) {
            if (index < 0 || index > this.children.length) {
                throw new Error('index does not exist');
            }
            if (child && child.hasChild && !this.hasChild(child)) {
                if (child.parent) {
                    child.parent.removeChild(child);
                }
                this.children.splice(index, 0, child);
                child.parent = this;
            }
        }

        /**
         * [removeChild description]
         * @param  {[type]} child [description]
         * @return {[type]}       [description]
         */
    }, {
        key: 'removeChild',
        value: function removeChild(child) {
            if (this.hasChild(child)) {
                this.removeChildAt(this.children.indexOf(child));
            } else {
                throw new Error('object is not a child');
            }
        }

        /**
         * [removeChildAt description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
    }, {
        key: 'removeChildAt',
        value: function removeChildAt(index) {
            if (index < 0 || index >= this.children.length) {
                throw new Error('index does not exist');
            }
            this.children[index].parent = null;
            this.children.splice(index, 1);
        }

        /**
         * [hasChild description]
         * @param  {[type]}  child [description]
         * @return {Boolean}       [description]
         */
    }, {
        key: 'hasChild',
        value: function hasChild(child) {
            return this.children.indexOf(child) !== -1;
        }

        /**
         * [getChildren description]
         * @return {[type]} [description]
         */
    }, {
        key: 'getChildren',
        value: function getChildren() {
            return this.children;
        }

        /**
         * [getChildByTagName description]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
    }, {
        key: 'getChildByTagName',
        value: function getChildByTagName(name) {}
        // implement

        /**
         * [getChildAt description]
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */

    }, {
        key: 'getChildAt',
        value: function getChildAt(index) {
            if (index < 0 || index >= this.children.length) {
                throw new Error('index does not exist');
            }
            return this.children[index];
        }
    }]);

    return Node;
})();

module.exports = Node;

},{"../math/Matrix":5,"../math/Vector":6}],13:[function(require,module,exports){
// shim layer with setTimeout fallback
"use strict";

window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
        };
})();

},{}]},{},[4])