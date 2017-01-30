/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Vector = __webpack_require__(3);
const Matrix = __webpack_require__(1);

class Node {

    /**
     * Node
     * 
     * @class Node
     * @constructor
     */
    constructor() {
    
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
    update(context) {  

        // update and draw
        context.save();
            this.updateMatrix(context); 
            this.draw(context);    
        context.restore();   

        // udpate childs
        for ( var i = 0, len = this.children.length; i < len; i++ ) {
            this.children[i].update(context); 
        } 
    }

    /**
     * [draw description]
     * @return {[type]} [description]
     */
    draw(context) {
        // overwrite
    }
        
    /**
     * update world matrix
     */
    updateMatrix(context) {  

        // build local matrix
        this.matrix.identity().transform(
            this.x + this.anchorX,
            this.y + this.anchorY, 
            this.rotation, 
            this.scale
        );

        // apply world matrix 
        // TODO check preMultiply
        if(this.parent) {
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
    localToGlobal(x, y) {
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
    globalToLocal(x, y) {
        // get mat, invert mat, append x,y
        var m = this.matrix.clone();
        return new Vector(x - m.a13, y - m.a23); // 600, 600 node 300, 300 -> 10, 10
    }

    /**
     * [addChild description]
     * @param {[type]} child [description]
     */
    addChild(child) {
        this.addChildAt(child, this.children.length);
    }

    /**
     * [addChildAt description]
     * @param {[type]} child [description]
     * @param {[type]} index [description]
     */
    addChildAt(child, index) {
        if(index < 0 || index > this.children.length) {
            throw new Error('index does not exist');
        }
        if(child && child.hasChild && !this.hasChild(child)) {
            if(child.parent) { 
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
    removeChild(child) {
        if(this.hasChild(child)) {
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
    removeChildAt(index) {
        if(index < 0 || index >= this.children.length) {
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
    hasChild(child) {
        return this.children.indexOf(child) !== -1;
    }

    /**
     * [getChildren description]
     * @return {[type]} [description]
     */
    getChildren() {
        return this.children;
    }

    /**
     * [getChildByTagName description]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    getChildByTagName(name) {
        // implement
    }

    /**
     * [getChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    getChildAt(index) {
        if(index < 0 || index >= this.children.length) {
            throw new Error('index does not exist');
        }
        return this.children[index];
    }
}

module.exports = Node;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


const Utils = __webpack_require__(2);
/**
 * [PRECISION description]
 * @type {Number}
 */
const PRECISION = 15;

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
const multiply = (m1, m2) => {
    var a11 = m1.a11;
    var a12 = m1.a12; 
    var a21 = m1.a21;
    var a22 = m1.a22;

    m1.a11 = (a11*m2.a11) + (a12*m2.a21);
    m1.a12 = (a11*m2.a12) + (a12*m2.a22); 
    m1.a13 = (a11*m2.a13) + (a12*m2.a23) + m1.a13; 

    m1.a21 = (a21*m2.a11) + (a22*m2.a21);
    m1.a22 = (a21*m2.a12) + (a22*m2.a22);
    m1.a23 = (a21*m2.a13) + (a22*m2.a23) + m1.a23;
};

class Matrix {

    /**
     * 3x3 Matrix
     * @class Matrix
     * @constructor
     */
    constructor() {
        //TODO param? (a,b,c,d,e,f) or (matrix), rename members
        this.identity();
    }
    
    /**
     * [translate description]
     * @param  {Number} tx
     * @param  {Number} ty
     * @return {Matrix}
     */
    translate(tx, ty) {
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
    rotate(angle) {
        angle = (angle*Utils.DEG_TO_RAD).toFixed(PRECISION); // or use radians?
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var a11 = this.a11;
        var a21 = this.a21;

        this.a11 = (cos*a11) + (sin*this.a12); 
        this.a12 = (-sin*a11) + (cos*this.a12); 
        this.a21 = (cos*a21) + (sin*this.a22);
        this.a22 = (-sin*a21) + (cos*this.a22); 
        return this;
    }

    /**
     * [scale description]
     * @param  {Number} scale
     * @return {Matrix}
     */
    scale(scale) {
        this.a11 *= scale; 
        this.a12 *= scale;  
        this.a21 *= scale; 
        this.a22 *= scale; 
        return this;
    }

    /**
     * [transform description]
     */
    transform(tx, ty, angle, scale) {
        return this.translate(tx, ty).rotate(angle).scale(scale);
    }

    /**
     * [multiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     */
    multiply(m) {
        multiply(this,m);
        return this;
    }

    /**
     * [preMultiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     */
    preMultiply(m) {
        multiply(m,this);
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
    inverse() {
        //TODO: check determinant
        var invdet = 1/this.determinant();
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
    determinant() {
        return this.a11 * this.a22 - this.a21 * this.a12;
    }

    /**
     * [identity description]
     * @return {Matrix} 
     */
    identity() {
        this.a11 = this.a22 = this.a33 = 1; 
        this.a12 = this.a13 = this.a21 = this.a23 = this.a31 = this.a32 = 0;
        return this;
    }

    /**
     * checks whether matrix is an identity matrix
     * @return {Boolean} 
     */
    isIdentity() {
        return  this.a11 === 1 && this.a12 === 0 && this.a13 === 0 &&
                this.a21 === 0 && this.a22 === 1 && this.a23 === 0;
    }

    /**
     * [decompose description]
     * @return {[type]} [description]
     */
    decompose() {
        var decomposed = {};
        decomposed.rotation = herman.math.Utils.RAD_TO_DEG * Math.atan2(this.a21,this.a11);
        return decomposed;
    }

    /**
     * clones matrix
     * @return {herman.math.Matrix}
     */
    clone() {
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
    print() {
        return  'matrix' + '\n' +
                this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' +  
                this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + 
                this.a31 + ' ' + this.a32 + ' ' + this.a33 + '\n';
    }
}

module.exports = Matrix

/***/ }),
/* 2 */
/***/ (function(module, exports) {


module.exports = {

    /**
     * Degrees to radians
     */
    DEG_TO_RAD : Math.PI/180,

    /**
     * Radians to degrees
     */
    RAD_TO_DEG : 180/Math.PI,

    /**
     * [angleBetweenPoints description]
     * @param  {[type]} p1 [description]
     * @param  {[type]} p2 [description]
     * @return {[type]}    [description]
     */
    angleBetweenPoints : function(p1, p2) {},

    /**
     * [intersect description]
     * @return {[type]} [description]
     */
    intersect : function(l1, l2) {}

};

/***/ }),
/* 3 */
/***/ (function(module, exports) {


class Vector {

    /**
     * Vector
     * @class Vector
     * @constructor
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * [add description]
     * @param {[type]} vec [description]
     */
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    /**
     * [substract description]
     * @param  {[type]} vec [description]
     * @return {[type]}     [description]
     */
    substract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    };

    /**
     * [normalize description]
     * @return {[type]} [description]
     */
    normalize() {
        var length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    };

    /**
     * [dot description]
     * @param  {[type]} vec [description]
     * @return {[type]}     [description]
     */
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    
    /**
     * [length description]
     * @return {[type]} [description]
     */
    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

}

module.exports = Vector

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// TODO: fix rewind
    
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
                if (effects[effectID]) {
                    effects[effectID].pause();    
                }
            },

            pauseAll : function() {
                Object.keys(effects).forEach(function(effect) {
                    effect.pause();
                });
            },

            resume : function(id) {
                if (effects[effectID]) {
                    effects[effectID].resume();    
                }
            },

            resumeAll : function() {
                Object.keys(effects).forEach(function(effect) {
                    effect.resume();
                });
            },

            stop : function(id) {
                if (effects[effectID]) {
                    effects[effectID].stop();    
                }
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
                            if(callback) {
                                callback();   
                            } 
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

module.exports = AudioPlayer;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * TODO: supported files
 * TODO: better checks
 * TODO: cross browser implementations
 * TODO: remove Protoype?
 */

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
        request.onload = () => {
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
        return this.source && this.source.playbackState === this.source.PLAYING_STATE;
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

module.exports = Sound;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {


const Node = __webpack_require__(0);

class DomNode extends Node {

    /**
     * Dom Node
     * @param {HTMLDivElement} element
     */
    constructor(element) {
        super();
        if(!element) {
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

    update() {  

        // update and draw
        this.updateMatrix(); 
        this.draw();     

        // udpate childs
        for ( var i = 0, len = this.children.length; i < len; i++ ) {
            this.children[i].update(); 
        } 
    }

    updateMatrix() {
        // build local matrix
        this.matrix.identity().transform(
            this.x + this.anchorX,
            this.y + this.anchorY, 
            this.rotation, 
            this.scale
        );

        // apply world matrix 
        // TODO check preMultiply
        if(this.parent) {
            var world = this.parent.matrix.clone();
            this.matrix = world.multiply(this.matrix);    
        } 

        // TODO cross browser
        var matrixString = 'matrix(' + this.matrix.a11 + ',' + this.matrix.a21 + ',' + this.matrix.a12 + ',' + this.matrix.a22 + ',' + this.matrix.a13 + ',' + this.matrix.a23 + ')'; 
        this.element.style.webkitTransform = matrixString;
    }

    addChild(child) {
        super.addChild.apply(this,arguments);
    
        //TODO use stage reference
        this.updateMatrix();
        document.getElementById('domStage').appendChild(child.element);
    }

    removeChild(child) {
        super.removeChild.apply(this,arguments);
        //TODO use stage reference
        document.getElementById('domStage').removeChild(child.element);
    }

}

module.exports = DomNode;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

class Renderer {

    /**
     * TODO: init with config
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
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
    update(node) {
        // clear
        //this.canvas.width = this.canvas.width;
        //this.context.fillStyle = '#FFFFFF';
        //this.context.fillRect(0, 0, this.width, this.height);
        this.context.clearRect(0, 0, this.width, this.height);
        
        // draw into buffer
        node.update(this.context);
    }

}

module.exports = Renderer;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var Node = __webpack_require__(0);

class Sprite extends Node {
    
    /**
     * Sprite
     * 
     * @class Sprite
     * @constructor
     */
    constructor(bitmap) {
        super();
        this.bitmap = bitmap;
    }

    draw(context) {      
        context.drawImage(this.bitmap, -this.bitmap.width/2, -this.bitmap.height/2);
    }

}

module.exports = Sprite;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Node = __webpack_require__(0);

class Text extends Node {
    
    /**
     * Text Node
     * @constructor
     */
    constructor(text) {
        super();
        this.text = text;
    }

    draw(context) {
        context.fillStyle = "#00F";
        context.font = "italic 30pt Arial";
        context.fillText(this.text, 20, 50);
    }

}

module.exports = Text;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
        };
})();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {


var herman = window.herman = {};    

__webpack_require__(10);

herman.math = {};
herman.math.utils = __webpack_require__(2);
herman.math.Vector = __webpack_require__(3);
herman.math.Matrix = __webpack_require__(1);

herman.Node = __webpack_require__(0);
herman.Sprite = __webpack_require__(8);
herman.Text = __webpack_require__(9);

herman.Renderer = __webpack_require__(7);

herman.audio = {};
herman.audio.AudioPlayer = __webpack_require__(4);
herman.audio.Sound = __webpack_require__(5);

herman.DomNode = __webpack_require__(6);


/***/ })
/******/ ]);