
(function(window) {

    /**
     * @module herman
     * @type {[type]}
     */
    var herman = window.herman = {};    

    /**
     * @property {Number} VERSION herman version
     */
    herman.VERSION = 0.1;

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

    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
            };
    })();

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
    }

    Renderer.prototype = {
        
        /**
         * trigger node update
         */
        update: function(node) {
            // clear
            this.canvas.width = this.canvas.width;
            
            // draw into buffer
            node.update(this.context);
        }
        
    };

    return Renderer;

});

herman.namespace('math.Matrix', function() {
    "use strict";
    
    /**
     * [PRECISION description]
     * @type {Number}
     */
    var PRECISION = 5;

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
        this.a13 += tx; //Math.round(tx); // tx | 0;
        this.a23 += ty; //Math.round(ty); // ty | 0;
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
        return this.translate(tx, ty).rotate(angle).scale(scale); // TxRxS
    };

    /**
     * [multiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     *
     * @example
     * 
     *                  | m.a11 m.a12 m.a13 |
     *                  | m.a21 m.a22 m.a23 |
     *                  | m.a31 m.a32 m.a33 |
     * | a11 a12 a13 |
     * | a21 a22 a23 |
     * | a31 a32 a33 |
     * 
     */
    Matrix.prototype.multiply = function(m) {
        var a11 = this.a11;
        var a12 = this.a12; 
        var a21 = this.a21;
        var a22 = this.a22;

        this.a11 = (a11*m.a11) + (a12*m.a21);
        this.a12 = (a11*m.a12) + (a12*m.a22); 
        this.a13 = (a11*m.a13) + (a12*m.a23) + this.a13; 

        this.a21 = (a21*m.a11) + (a22*m.a21);
        this.a22 = (a21*m.a12) + (a22*m.a22);
        this.a23 = (a21*m.a13) + (a22*m.a23) + this.a23;
        return this;
    };

    /**
     * [preMultiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     *
     * @example
     *
     *                      | a11 a12 a13 |
     *                      | a21 a22 a23 |
     *                      | a31 a32 a33 |
     * | m.a11 m.a12 m.a13 |
     * | m.a21 m.a22 m.a23 |
     * | m.a31 m.a32 m.a33 |
     * 
     */
    Matrix.prototype.preMultiply = function(m) {
        var a11 = m.a11;
        var a12 = m.a12; 
        var a21 = m.a21;
        var a22 = m.a22;

        this.a11 = (a11*this.a11) + (a12*this.a21);
        this.a12 = (a11*this.a12) + (a12*this.a22); 
        this.a13 = (a11*this.a13) + (a12*this.a23) + m.a13; 

        this.a21 = (a21*this.a11) + (a22*this.a21);
        this.a22 = (a21*this.a12) + (a22*this.a22);
        this.a23 = (a21*this.a13) + (a22*this.a23) + m.a23;
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
         * Degrees to radians helper
         */
        DEG_TO_RAD : Math.PI/180,

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

// herman.namespace("DomNode",function(){

//  /**
//   * Dom Node
//   * @param {HTMLDivElement} element
//   */
//  function DomNode(element) {
//      herman.Node.call(this); 
        
//      if(!element) {
//          // dev style
//          this.element = document.createElement("div");
//          this.element.className = "div-node";
//          this.element.style.width = '100px';
//          this.element.style.height = '100px';
//          this.element.style.backgroundColor = 'white';
//          this.element.style.border = '1px solid red';
    
//      } else {
//          this.element = element;
//      }   

//      // force gpu rendering
//      this.element.style.webkitPerspective = 1000;
//      this.element.style.webkitBackfaceVisibility = "hidden";
//      // node styles
//      this.element.style.position = "absolute";
//  }

// // proto
//  var _p = herman.inherits(DomNode, herman.Node);

//  _p.update = function() {
//      var matrix = this.getMatrix();

//      // TODO cross browser
//      this.element.style.webkitTransform = 'matrix(' + matrix.a11 + ',' + matrix.a21 + ',' + matrix.a12 + ',' + matrix.a22 + ',' + matrix.a13 + ',' + matrix.a23 + ')';   
        
//      // update children
//      for (var i = 0; i < this.children.length; i++) {
//          this.children[i].update();
//      }
//  }

// // scene
//  _p.addChild = function(child) {
        
//      this.super.addChild.apply(this,arguments); // super
//      child.update();
//      //TODO use stage reference
//      document.getElementById('domStage').appendChild(child.element);
//  };

//  _p.removeChild = function(child) {
//      this.super.removeChild.apply(this,arguments); // super
//      //TODO use stage reference
//      document.getElementById('domStage').removeChild(child.element);
//  };

//  return DomNode;

// });


herman.namespace('Node', function() {
    "use strict";

    /**
     * Node
     * 
     * @class Node
     * @constructor
     */
    function Node() {
        this.tag = undefined;
        this.stage = undefined;
        this.parent = undefined;
        this.children = [];

        // world transform
        this.matrix = new herman.math.Matrix(); 

        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.rotation = 0; 

        // anchor 0-1 or px
        this.anchorX = 0;
        this.anchorY = 0;

        // w/h
        this.width = 0;
        this.height = 0;
    }

    /**
     * [update description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
    Node.prototype.update = function(context) {  
        this.updateMatrix(); 
        this.draw(context);
        this.children.forEach(function(element) {
            element.update(context);
        });
    };

    /**
     * [draw description]
     * @return {[type]} [description]
     */
    Node.prototype.draw = function(context) {
        
    };
        
    /**
     * update world matrix
     */
    Node.prototype.updateMatrix = function() {  
        this.matrix.identity().transform(
            this.x + this.anchorX,
            this.y + this.anchorY, 
            this.rotation, 
            this.scale
        );

        if(this.parent) {
            this.matrix.preMultiply(this.parent.matrix);    
        } 
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
            console.log('index out of bounds');
            return;
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
        }
    };

    /**
     * [removeChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    Node.prototype.removeChildAt = function(index) {
        if(index < 0 || index >= this.children.length) {
            console.log('index out of bounds');
            return;
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
     * [getChild description]
     * @param  {[type]} child [description]
     * @return {[type]}       [description]
     */
    Node.prototype.getChild = function(child) {
        var index = this.children.indexOf(child);
        return (index !== -1) ? this.children[index] : undefined;
    };

    /**
     * [getChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    Node.prototype.getChildAt = function(index) {
        if(index < 0 || index >= this.children.length) {
            console.log('index out of bounds');
            return;
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

    //TODO custom draw method
    Sprite.prototype.draw = function(context) {
        var matrix = this.matrix;
        //context.save();
            context.setTransform(matrix.a11, matrix.a21, matrix.a12, matrix.a22, matrix.a13, matrix.a23);
            context.drawImage(this.bitmap, -this.bitmap.width/2, -this.bitmap.height/2);
        //context.restore();
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
    var _p = herman.inherits(Text, herman.Node);

    //TODO custom draw method
    _p.draw = function(context) {
        var matrix = this.getMatrix();
        context.save();
            context.setTransform(matrix.a11, matrix.a21, matrix.a12, matrix.a22, matrix.a13, matrix.a23);
            context.fillStyle = "#00F";
            context.font = "italic 30pt Arial";
            context.fillText(this.text, 20, 50);
        context.restore();
    };

    return Text;

});
