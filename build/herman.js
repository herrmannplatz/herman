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

herman.namespace('Renderer', function() {
    "use strict";  

    /**
     * TODO: init with config
     * @param {HTMLCanvasElement} canvas 
     */
    function Renderer(canvas) {
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

    Renderer.prototype = {
        
        /**
         * trigger node update
         */
        update: function(node) {
            // clear
            //this.canvas.width = this.canvas.width;
            //this.context.fillStyle = '#FFFFFF';
            //this.context.fillRect(0, 0, this.width, this.height);
            this.context.clearRect(0, 0, this.width, this.height);
            
            // draw into buffer
            node.update(this.context);
        }
        
    };

    return Renderer;

});

herman.namespace('math.Matrix', function() {
    "use strict";

// private 

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
    var multiply = function(m1, m2) {
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

// public

    /**
     * 3x3 Matrix
     * @class Matrix
     * @constructor
     */
    function Matrix() {
        //TODO param? (a,b,c,d,e,f) or (matrix), rename members
        this.identity();
    }
    
    /**
     * [translate description]
     * @param  {Number} tx
     * @param  {Number} ty
     * @return {Matrix}
     */
    Matrix.prototype.translate = function(tx, ty) {
        this.a13 += tx;
        this.a23 += ty; 
        return this;
    };

    /**
     * [rotate description]j
     * @param  {Number} angle radians
     * @return {Matrix}
     */
    Matrix.prototype.rotate = function(angle) {
        angle = (angle*herman.math.Utils.DEG_TO_RAD).toFixed(PRECISION); // or use radians?
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var a11 = this.a11;
        var a21 = this.a21;

        this.a11 = (cos*a11) + (sin*this.a12); 
        this.a12 = (-sin*a11) + (cos*this.a12); 
        this.a21 = (cos*a21) + (sin*this.a22);
        this.a22 = (-sin*a21) + (cos*this.a22); 
        return this;
    };

    /**
     * [scale description]
     * @param  {Number} scale
     * @return {Matrix}
     */
    Matrix.prototype.scale = function(scale) {
        this.a11 *= scale; 
        this.a12 *= scale;  
        this.a21 *= scale; 
        this.a22 *= scale; 
        return this;
    };

    /**
     * [transform description]
     */
    Matrix.prototype.transform = function(tx, ty, angle, scale) {
        return this.translate(tx, ty).rotate(angle).scale(scale);
    };

    /**
     * [multiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     */
    Matrix.prototype.multiply = function(m) {
        multiply(this,m);
        return this;
    };

    /**
     * [preMultiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     */
    Matrix.prototype.preMultiply = function(m) {
        multiply(m,this);
        return this;    
    };

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
    Matrix.prototype.inverse = function() {
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
    };

    /**
     * [determinant description]
     *
     * | a11 a12 a13 | a11 a12
     * | a21 a22 a23 | a21 a22
     * | a31 a32 a33 | a31 a32
     *
     * @return {Number}
     */
    Matrix.prototype.determinant = function() {
        return this.a11 * this.a22 - this.a21 * this.a12;
    };

    /**
     * [identity description]
     * @return {Matrix} 
     */
    Matrix.prototype.identity = function() {
        this.a11 = this.a22 = this.a33 = 1; 
        this.a12 = this.a13 = this.a21 = this.a23 = this.a31 = this.a32 = 0;
        return this;
    };

    /**
     * checks wether matrix is an identity matrix
     * @return {Boolean} 
     */
    Matrix.prototype.isIdentity = function() {
        return  this.a11 === 1 && this.a12 === 0 && this.a13 === 0 &&
                this.a21 === 0 && this.a22 === 1 && this.a23 === 0;
    };

    /**
     * [decompose description]
     * @return {[type]} [description]
     */
    Matrix.prototype.decompose = function() {
        var decomposed = {};
        decomposed.rotation = herman.math.Utils.RAD_TO_DEG * Math.atan2(this.a21,this.a11);
        return decomposed;
    };

    /**
     * [clone description]
     * @return {herman.math.Matrix} [description]
     */
    Matrix.prototype.clone = function() {
        var m = new Matrix();
        m.a11 = this.a11;
        m.a12 = this.a12;
        m.a13 = this.a13;
        m.a21 = this.a21;
        m.a22 = this.a22;
        m.a23 = this.a23;
        return m;
    };

    /**
     * returns matrix as a nicely formatted string
     * @return {String}
     */
    Matrix.prototype.print = function() {
        return  'matrix' + '\n' +
                this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' +  
                this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + 
                this.a31 + ' ' + this.a32 + ' ' + this.a33 + '\n';
    };

    return Matrix;

});

herman.namespace('math.Utils', function() {
    "use strict";

    var Utils = {

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

    return Utils;

});

herman.namespace('math.Vector', function() {
    "use strict";

    /**
     * Vector
     * @class Vector
     * @constructor
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * [add description]
     * @param {[type]} vec [description]
     */
    Vector.prototype.add  = function(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    };

    /**
     * [substract description]
     * @param  {[type]} vec [description]
     * @return {[type]}     [description]
     */
    Vector.prototype.substract = function(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    };

    /**
     * [normalize description]
     * @return {[type]} [description]
     */
    Vector.prototype.normalize = function() {
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
    Vector.prototype.dot = function(vec) {
        return this.x * vec.x + this.y * vec.y;
    };
    
    /**
     * [length description]
     * @return {[type]} [description]
     */
    Vector.prototype.length = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };

    return Vector;

});

herman.namespace('Tween', function() {
    "use strict";

    /**
     * flash like tweening object
     *
     * @example
     * var tween = new Tween(node, { x : 100 }, 1000);
     * tween.done = function() { console.log('tweening finished') }
     * tween.start();
     * 
     * @param {herman.Node} target     [description]
     * @param {Object} properties [description]
     * @param {Number} duration   [description]
     */
    function Tween(target, properties, duration) {

            // tween object
        var tween = {},

            // start time
            start = new Date().getTime(),   

            // delta start current time
            delta,  

            // normalized delta
            progress,

            // storage for start values       
            begin = {},
            
            // requestAnimationFrame ID
            requestID,

            // done callback
            done = function() {};

        // store start values
        Object.keys(properties).forEach(function(property){
            begin[property] = target[property];
        });

        tween.start = function() {
            (function update() {

                delta = new Date().getTime() - start;

                progress = Math.min(delta/duration, 1);

                // TODO easing
                Object.keys(properties).forEach(function(property) {
                    target[property] = begin[property] + (( properties[property] - begin[property]) * progress );
                });          

                window.renderer.update(window.stage);                

                if (progress < 1) {
                    requestID = window.requestAnimationFrame(update); 
                } else {
                    if(done) {
                        done();    
                    } 
                    window.cancelAnimationFrame(requestID);      
                }

            })();
        };

        tween.stop = function() {
            window.cancelAnimationFrame(requestID);
        };

        tween.clone = function() {
            return new Tween(target, properties, duration);
        };

        tween.done = function(callback) {
            done = callback;
            return this;
        };

        return tween;
    }

    return Tween;

});

herman.namespace('Node', function() {
    "use strict";

    /**
     * Node
     * 
     * @class Node
     * @constructor
     */
    function Node() {

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
        this.matrix = new herman.math.Matrix(); 

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
    Node.prototype.update = function(context) {  

        // update and draw
        context.save();
            this.updateMatrix(context); 
            this.draw(context);    
        context.restore();   

        // udpate childs
        for ( var i = 0, len = this.children.length; i < len; i++ ) {
            this.children[i].update(context); 
        } 
    };

    /**
     * [draw description]
     * @return {[type]} [description]
     */
    Node.prototype.draw = function(context) {
        // overwrite
    };
        
    /**
     * update world matrix
     */
    Node.prototype.updateMatrix = function(context) {  

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
    };

    /**
     * [localToGlobal description]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    Node.prototype.localToGlobal = function(x, y) {
        var m = this.matrix.clone();
        m.translate(x, y);
        return new herman.math.Vector(m.a13, m.a23);
    };

    /**
     * [globalToLocal description]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    Node.prototype.globalToLocal = function(x, y) {
        // get mat, invert mat, append x,y
        var m = this.matrix.clone();
        return new herman.math.Vector(x - m.a13, y - m.a23); // 600, 600 node 300, 300 -> 10, 10
    };

    /**
     * [addChild description]
     * @param {[type]} child [description]
     */
    Node.prototype.addChild = function(child) {
        this.addChildAt(child, this.children.length);
    };

    /**
     * [addChildAt description]
     * @param {[type]} child [description]
     * @param {[type]} index [description]
     */
    Node.prototype.addChildAt = function(child, index) {
        if(index < 0 || index > this.children.length) {
            throw new Error('index does not exist');
        }
        if(child instanceof Node && !this.hasChild(child)) {
            if(child.parent) { 
                child.parent.removeChild(child);
            }
            this.children.splice(index, 0, child);
            child.parent = this;    
        }
    };

    /**
     * [removeChild description]
     * @param  {[type]} child [description]
     * @return {[type]}       [description]
     */
    Node.prototype.removeChild = function(child) {
        if(child instanceof Node && this.hasChild(child)) {
            this.removeChildAt(this.children.indexOf(child));
        } else {
            throw new Error('object is not a child');
        }
    };

    /**
     * [removeChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    Node.prototype.removeChildAt = function(index) {
        if(index < 0 || index >= this.children.length) {
            throw new Error('index does not exist');
        }
        this.children[index].parent = null;
        this.children.splice(index, 1);
    };

    /**
     * [hasChild description]
     * @param  {[type]}  child [description]
     * @return {Boolean}       [description]
     */
    Node.prototype.hasChild = function(child) {
        return this.children.indexOf(child) !== -1;
    };

    /**
     * [getChildren description]
     * @return {[type]} [description]
     */
    Node.prototype.getChildren = function() {
        return this.children;
    };

    /**
     * [getChildByTagName description]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    Node.prototype.getChildByTagName = function(name) {
        // implement
    };

    /**
     * [getChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    Node.prototype.getChildAt = function(index) {
        if(index < 0 || index >= this.children.length) {
            throw new Error('index does not exist');
        }
        return this.children[index];
    };

// expose
    return Node;

});

herman.namespace("Sprite", function() {
    "use strict";
    
    /**
     * Sprite
     * 
     * @class Sprite
     * @constructor
     */
    function Sprite(bitmap) {
        herman.Node.call(this);
        this.bitmap = bitmap;

    }

// proto
    herman.inherits(Sprite, herman.Node);

    Sprite.prototype.draw = function(context) {      
        context.drawImage(this.bitmap, -this.bitmap.width/2, -this.bitmap.height/2);
    };

    return Sprite;

});


herman.namespace("Text", function() {
    "use strict";
    
    /**
     * Text Node
     * @constructor
     */
    function Text(text) {
        herman.Node.call(this);
        this.text = text;
    }

// proto
    herman.inherits(Text, herman.Node);

    Text.prototype.draw = function(context) {
        context.fillStyle = "#00F";
        context.font = "italic 30pt Arial";
        context.fillText(this.text, 20, 50);
    };

    return Text;

});


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


// expose
    return AudioPlayer;

});
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

herman.namespace("DomNode",function(){

 /**
  * Dom Node
  * @param {HTMLDivElement} element
  */
 function DomNode(element) {
     herman.Node.call(this);
        
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

// proto
    herman.inherits(DomNode, herman.Node);

    DomNode.prototype.update = function() {  

        // update and draw
        this.updateMatrix(); 
        this.draw();     

        // udpate childs
        for ( var i = 0, len = this.children.length; i < len; i++ ) {
            this.children[i].update(); 
        } 
    };

    DomNode.prototype.updateMatrix = function() {
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
    };

// scene
     DomNode.prototype.addChild = function(child) {
            
         this.super.addChild.apply(this,arguments); // super
        
         //TODO use stage reference
         this.updateMatrix();
         document.getElementById('domStage').appendChild(child.element);
     };

     DomNode.prototype.removeChild = function(child) {
         this.super.removeChild.apply(this,arguments); // super
         //TODO use stage reference
         document.getElementById('domStage').removeChild(child.element);
     };

     return DomNode;

});
