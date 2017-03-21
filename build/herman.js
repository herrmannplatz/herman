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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__math_vector__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__math_matrix__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Node = function () {
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
    this.matrix = new __WEBPACK_IMPORTED_MODULE_1__math_matrix__["a" /* default */]();

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
      return new __WEBPACK_IMPORTED_MODULE_0__math_vector__["a" /* default */](m.a13, m.a23);
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
      return new __WEBPACK_IMPORTED_MODULE_0__math_vector__["a" /* default */](x - m.a13, y - m.a23); // 600, 600 node 300, 300 -> 10, 10
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
      return this.children.includes(child);
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
}();

/* harmony default export */ __webpack_exports__["a"] = Node;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_helpers__ = __webpack_require__(10);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

var Sound = function () {
  function Sound(file) {
    var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var volume = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, Sound);

    this.gainNode = undefined;
    this.source = undefined;
    this.buffer = undefined;
    this.startOffset = 0;
    this.startTime = 0;
    this.volume = volume;
    this.loop = loop;
    this.file = file;
    this.laoded = false;
  }

  _createClass(Sound, [{
    key: 'load',
    value: function load() {
      var _this = this;

      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_helpers__["a" /* fetchArrayBuffer */])(this.file).then(function (buffer) {
        return context.decodeAudioData(buffer);
      }).then(function (audioBuffer) {
        _this.buffer = audioBuffer;
        return _this.buffer;
      }).catch(function (error) {
        return console.warn('Unable to load sound' + _this.file + error.message);
      });
    }
  }, {
    key: 'play',
    value: function play(offset) {
      var _this2 = this;

      if (this.source || this.isPlaying()) {
        return;
      }

      Promise.resolve().then(function () {
        if (!_this2.loaded()) {
          return _this2.load();
        }
      }).then(function () {
        _this2.source = context.createBufferSource();
        _this2.source.buffer = _this2.buffer;

        _this2.gainNode = context.createGain();
        _this2.source.connect(_this2.gainNode);
        _this2.gainNode.connect(context.destination);

        _this2.source.loop = _this2.loop;
        _this2.gainNode.gain.value = _this2.volume;

        _this2.startTime = context.currentTime;
        _this2.source.start(0, offset || 0);
      });
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.stop();
      this.startOffset += context.currentTime - this.startTime;
    }
  }, {
    key: 'resume',
    value: function resume() {
      this.play(this.startOffset % this.buffer.duration);
    }
  }, {
    key: 'rewind',
    value: function rewind() {
      this.play(0);
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.source) {
        this.source.stop(0);
      }
    }
  }, {
    key: 'isPlaying',
    value: function isPlaying() {
      return this.source && this.source.playbackState === this.source.PLAYING_STATE;
    }
  }, {
    key: 'volume',
    set: function set(volume) {
      if (this.gainNode) {
        this.gainNode.gain.value = volume;
      }
    },
    get: function get() {
      if (this.gainNode) {
        return this.gainNode.gain.value;
      }
    }
  }, {
    key: 'loaded',
    get: function get() {
      return this.buffer !== undefined;
    }
  }]);

  return Sound;
}();

/* harmony default export */ __webpack_exports__["a"] = Sound;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(3);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/**
 * [PRECISION description]
 * @type {Number}
 */
var PRECISION = 15;

var Matrix = function () {
  /**
   * 3x3 Matrix
   * @class Matrix
   * @constructor
   */
  function Matrix() {
    _classCallCheck(this, Matrix);

    // TODO param? (a,b,c,d,e,f) or (matrix), rename members
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
      angle = (angle * __WEBPACK_IMPORTED_MODULE_0__utils__["DEG_TO_RAD"]).toFixed(PRECISION); // or use radians?
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
      Matrix.multiply(this, m);
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
      Matrix.multiply(m, this);
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
      // TODO: check determinant
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
      decomposed.rotation = __WEBPACK_IMPORTED_MODULE_0__utils__["RAD_TO_DEG"] * Math.atan2(this.a21, this.a11);
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

  }, {
    key: 'print',


    /**
     * returns matrix as a nicely formatted string
     * @return {String}
     */
    value: function print() {
      return 'matrix' + '\n' + this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' + this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + this.a31 + ' ' + this.a32 + ' ' + this.a33 + '\n';
    }
  }], [{
    key: 'multiply',
    value: function multiply(m1, m2) {
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
    }
  }]);

  return Matrix;
}();

/* harmony default export */ __webpack_exports__["a"] = Matrix;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEG_TO_RAD", function() { return DEG_TO_RAD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RAD_TO_DEG", function() { return RAD_TO_DEG; });

/**
 * Degrees to radians
 */
var DEG_TO_RAD = Math.PI / 180;

/**
 * Radians to degrees
 */
var RAD_TO_DEG = 180 / Math.PI;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector = function () {
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

    /**
     * [normalize description]
     * @return {[type]} [description]
     */

  }, {
    key: "normalize",
    value: function normalize() {
      var length = this.length();
      this.x /= length;
      this.y /= length;
      return this;
    }

    /**
     * [dot description]
     * @param  {[type]} vec [description]
     * @return {[type]}     [description]
     */

  }, {
    key: "dot",
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
}();

/* harmony default export */ __webpack_exports__["a"] = Vector;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Sound__ = __webpack_require__(1);


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
 * influenced by cocos2d SimpleAudioEngine
 * TODO: fix rewind
 */
/* harmony default export */ __webpack_exports__["a"] = {

  background: {

    play: function play(file, loop) {
      if (background) {
        background.stop();
        background = null;
      }
      background = new __WEBPACK_IMPORTED_MODULE_0__Sound__["a" /* default */](file, loop);
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
      return background.volume;
    },

    setVolume: function setVolume(volume) {
      background.volume = volume;
    }
  },

  effects: {

    play: function play(file, loop) {
      effects[effectID] = new __WEBPACK_IMPORTED_MODULE_0__Sound__["a" /* default */](file, loop, effectVolume);
      return effectID;
    },

    getVolume: function getVolume() {
      return effectVolume;
    },

    setVolume: function setVolume(volume) {
      effectVolume = volume;
      Object.entries(effects).forEach(function (effect) {
        return effect.volume(volume);
      });
    },

    pause: function pause(id) {
      if (effects[effectID]) {
        effects[effectID].pause();
      }
    },

    pauseAll: function pauseAll() {
      Object.entries(effects).forEach(function (effect) {
        return effect.pause();
      });
    },

    resume: function resume(id) {
      if (effects[effectID]) {
        effects[effectID].resume();
      }
    },

    resumeAll: function resumeAll() {
      Object.entries(effects).forEach(function (effect) {
        return effect.resume();
      });
    },

    stop: function stop(id) {
      if (effects[effectID]) {
        effects[effectID].stop();
      }
    },

    stopAll: function stopAll() {
      Object.entries(effects).forEach(function (effect) {
        return effect.stop();
      });
    }

  },

  preloader: {

    preload: function preload(manifest) {
      return Promise.all(manifest.map(function (src) {
        return new __WEBPACK_IMPORTED_MODULE_0__Sound__["a" /* default */](src);
      }));
    }
  }

};

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_node__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var DomNode = function (_Node) {
  _inherits(DomNode, _Node);

  /**
   * Dom Node
   * @param {HTMLDivElement} element
   */
  function DomNode(element) {
    _classCallCheck(this, DomNode);

    var _this = _possibleConstructorReturn(this, (DomNode.__proto__ || Object.getPrototypeOf(DomNode)).call(this));

    if (!element) {
      // dev style
      _this.element = document.createElement('div');
      _this.element.className = 'div-node';
      _this.element.style.width = '100px';
      _this.element.style.height = '100px';
      _this.element.style.backgroundColor = 'white';
      _this.element.style.border = '1px solid red';
    } else {
      _this.element = element;
    }

    // force gpu rendering
    _this.element.style.webkitPerspective = 1000;
    _this.element.style.webkitBackfaceVisibility = 'hidden';
    // node styles
    _this.element.style.position = 'absolute';
    return _this;
  }

  _createClass(DomNode, [{
    key: 'update',
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
    key: 'updateMatrix',
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
    key: 'addChild',
    value: function addChild(child) {
      _get(DomNode.prototype.__proto__ || Object.getPrototypeOf(DomNode.prototype), 'addChild', this).apply(this, arguments);

      // TODO use stage reference
      this.updateMatrix();
      document.getElementById('domStage').appendChild(child.element);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      _get(DomNode.prototype.__proto__ || Object.getPrototypeOf(DomNode.prototype), 'removeChild', this).apply(this, arguments);
      // TODO use stage reference
      document.getElementById('domStage').removeChild(child.element);
    }
  }]);

  return DomNode;
}(__WEBPACK_IMPORTED_MODULE_0__scene_node__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = DomNode;

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
  /**
   * TODO: init with config
   * @param {HTMLCanvasElement} canvas
   */
  function Renderer(canvas) {
    _classCallCheck(this, Renderer);

    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  /**
   * trigger node update
   */


  _createClass(Renderer, [{
    key: 'update',
    value: function update(node) {
      this.context.clearRect(0, 0, this.width, this.height);
      node.update(this.context);
    }
  }]);

  return Renderer;
}();

/* harmony default export */ __webpack_exports__["a"] = Renderer;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var Sprite = function (_Node) {
  _inherits(Sprite, _Node);

  function Sprite(bitmap) {
    _classCallCheck(this, Sprite);

    var _this = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this));

    _this.bitmap = bitmap;
    return _this;
  }

  _createClass(Sprite, [{
    key: 'draw',
    value: function draw(context) {
      context.drawImage(this.bitmap, -this.bitmap.width / 2, -this.bitmap.height / 2);
    }
  }]);

  return Sprite;
}(__WEBPACK_IMPORTED_MODULE_0__node__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = Sprite;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var Text = function (_Node) {
  _inherits(Text, _Node);

  function Text(text) {
    _classCallCheck(this, Text);

    var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this));

    _this.text = text;
    return _this;
  }

  _createClass(Text, [{
    key: 'draw',
    value: function draw(context) {
      context.fillStyle = '#00F';
      context.font = 'italic 30pt Arial';
      context.fillText(this.text, 20, 50);
    }
  }]);

  return Text;
}(__WEBPACK_IMPORTED_MODULE_0__node__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = Text;

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fetchArrayBuffer;
function fetchArrayBuffer(file) {
  return new Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(this.response);
      } else {
        reject(this.statusText);
      }
    };
    xhr.onerror = reject;
    xhr.send();
  });
}

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__render_Renderer__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scene_node__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scene_sprite__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scene_text__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__math_utils__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__math_vector__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__math_matrix__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__audio_AudioPlayer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__audio_Sound__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__experimental_domnode__ = __webpack_require__(6);















var herman = window.herman = {};

herman.math = {};
herman.math.utils = __WEBPACK_IMPORTED_MODULE_4__math_utils__;
herman.math.Vector = __WEBPACK_IMPORTED_MODULE_5__math_vector__["a" /* default */];
herman.math.Matrix = __WEBPACK_IMPORTED_MODULE_6__math_matrix__["a" /* default */];

herman.Node = __WEBPACK_IMPORTED_MODULE_1__scene_node__["a" /* default */];
herman.Sprite = __WEBPACK_IMPORTED_MODULE_2__scene_sprite__["a" /* default */];
herman.Text = __WEBPACK_IMPORTED_MODULE_3__scene_text__["a" /* default */];

herman.Renderer = __WEBPACK_IMPORTED_MODULE_0__render_Renderer__["a" /* default */];

herman.audio = {};
herman.audio.AudioPlayer = __WEBPACK_IMPORTED_MODULE_7__audio_AudioPlayer__["a" /* default */];
herman.audio.Sound = __WEBPACK_IMPORTED_MODULE_8__audio_Sound__["a" /* default */];

herman.DomNode = __WEBPACK_IMPORTED_MODULE_9__experimental_domnode__["a" /* default */];

/***/ })
/******/ ]);