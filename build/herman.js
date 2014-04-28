
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

herman.namespace('Renderer',function(){
    "use strict"  

    /**
     * 
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

herman.namespace('Math',function(){
    "use strict"

    return {

        /**
         * Degrees to radians helper
         */
        DEG_TO_RAD : Math.PI/180
    };

});

herman.namespace('Matrix',function(){

	// TODO scaleX, scaleY or scaleNonUniform

	var PRECISION = 5;

	/**
	 * 3x3 Matrix
	 * @class Matrix
	 * @constructor
	 */
	function Matrix() {
		//TODO param? (a,b,c,d,e,f) or (matrix), rename members
		this.a11 = 1; 
		this.a12 = 0;
		this.a13 = 0;
		this.a21 = 0;
		this.a22 = 1;
		this.a23 = 0;
	}

	Matrix.prototype = {
		
		/**
		 * [translate description]
		 * @param  {Number} tx
		 * @param  {Number} ty
		 * @return {Matrix}
		 */
		translate : function(tx, ty) {
			this.a13 += tx; //Math.round(tx); // tx | 0;
			this.a23 += ty; //Math.round(ty); // ty | 0;
			return this;
		},

		/**
		 * [rotate description]
		 * @param  {Number} angle radians
		 * @return {Matrix}
		 */
		rotate : function(angle) {
			angle = (angle*herman.Math.DEG_TO_RAD).toFixed(PRECISION); // or use radians?
			var sin = Math.sin(angle);
			var cos = Math.cos(angle);
			var a11 = this.a11;
			var a21 = this.a21;

			this.a11 = (cos*a11) + (sin*this.a12); 
			this.a12 = (-sin*a11) + (cos*this.a12); 
			this.a21 = (cos*a21) + (sin*this.a22);
			this.a22 = (-sin*a21) + (cos*this.a22); 
			return this;
		},

		/**
		 * [scale description]
		 * @param  {Number} scale
		 * @return {Matrix}
		 */
		scale : function(scale) {
			this.a11 *= scale; 
			this.a12 *= scale;  
			this.a21 *= scale; 
			this.a22 *= scale; 
			return this;
		},

		/**
		 * [transform description]
		 */
		transform : function(tx, ty, angle, scale) {
			return this.translate(tx, ty).rotate(angle).scale(scale); // TxRxS
		},

		/**
		 * [multiply description]
		 * @param  {Matrix} m
		 * @return {Matrix}
		 *
		 * @example
		 * 
		 *					| m.a11 m.a12 m.a13 |
		 *     				| m.a21 m.a22 m.a23 |
		 *         			| m.a31 m.a32 m.a33 |
		 * | a11 a12 a13 |
		 * | a21 a22 a23 |
		 * | a31 a32 a33 |
		 * 
		 */
		multiply : function(m) {
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
		},

		invert : function() {
			
		},

		/**
		 * [identity description]
		 * @return {Matrix} [description]
		 */
		identity : function() {
			this.a11 = 1; 
			this.a12 = 0;
			this.a13 = 0;
			this.a21 = 0;
			this.a22 = 1;
			this.a23 = 0;
			return this;
		},

		/**
		 * [toString description]
		 * @return {String}
		 */
		print : function() {
			return 	'matrix' + '\n' +
					this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' +  
					this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + 
					'[0]'	 + ' ' + '[0]'	  + ' ' + '[1]'	   + '\n';
		}

	};

	return Matrix;

});

herman.namespace('Vector',function(){
    "use strict"

    /**
     * Vector
     * @class Vector
     * @constructor
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector.prototype = {
        
        add: function(x,y ) {
            this.x += x;
            this.y += y;
        }
        
    };

    return Vector;

});

herman.namespace('Tween',function(){
    "use strict"

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
                    done && done();
                    window.cancelAnimationFrame(requestID);      
                }

            })();
        };

        tween.stop = function() {
            window.cancelAnimationFrame(requestID);
        };

        tween.clone = function() {
            return new Tween(target, property, duration);
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

// 	/**
// 	 * Dom Node
// 	 * @param {HTMLDivElement} element
// 	 */
// 	function DomNode(element) {
// 		herman.Node.call(this); 
		
// 		if(!element) {
// 			// dev style
// 			this.element = document.createElement("div");
// 			this.element.className = "div-node";
// 			this.element.style.width = '100px';
// 			this.element.style.height = '100px';
// 			this.element.style.backgroundColor = 'white';
// 			this.element.style.border = '1px solid red';
	
// 		} else {
// 			this.element = element;
// 		}	

// 		// force gpu rendering
// 		this.element.style.webkitPerspective = 1000;
// 		this.element.style.webkitBackfaceVisibility = "hidden";
// 		// node styles
// 		this.element.style.position = "absolute";
// 	}

// // proto
// 	var _p = herman.inherits(DomNode, herman.Node);

// 	_p.update = function() {
// 		var matrix = this.getMatrix();

// 		// TODO cross browser
// 		this.element.style.webkitTransform = 'matrix(' + matrix.a11 + ',' + matrix.a21 + ',' + matrix.a12 + ',' + matrix.a22 + ',' + matrix.a13 + ',' + matrix.a23 + ')';	
		
// 		// update children
// 		for (var i = 0; i < this.children.length; i++) {
// 			this.children[i].update();
// 		}
// 	}

// // scene
// 	_p.addChild = function(child) {
		
// 		this.super.addChild.apply(this,arguments); // super
// 		child.update();
// 		//TODO use stage reference
// 		document.getElementById('domStage').appendChild(child.element);
// 	};

// 	_p.removeChild = function(child) {
// 		this.super.removeChild.apply(this,arguments); // super
// 		//TODO use stage reference
// 		document.getElementById('domStage').removeChild(child.element);
// 	};

// 	return DomNode;

// });


herman.namespace('Node',function(){
	"use strict"

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
		this.matrix = new herman.Matrix(); // calculate on the fly
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

// prototype
	Node.prototype = {

		update : function(context) {        
	        // update children
	        this.children.forEach(function(element){
	            element.update(context);
	        });
	    },

	// transform
		
		/**
		 * get world matrix
		 * @return {herman.Matrix} 
		 */
		getMatrix : function() {	
			//this.matrix.identity(); // clear		
			this.matrix = new herman.Matrix().transform(this.x + this.anchorX,this.y + this.anchorY, this.rotation, this.scale); // avoid new matrix

			if (this.parent) {
				this.matrix = this.parent.getMatrix().multiply(this.matrix); //TODO use loop ?
			} 
			return this.matrix;
		},

		localToGlobal : function(x, y) {
			var mat = this.getMatrix();
			mat.translate(x, y);
			return new herman.Vector(mat.a13, mat.a23);

		},

		globalToLocal : function(x, y) {
			// get mat, invert mat, append x,y
			var mat = this.getMatrix();
			return new herman.Vector(x - mat.a13, y - mat.a23); // 600, 600 node 300, 300 -> 10, 10
		},

	// scene graph
			
		addChild : function(child) {
			this.addChildAt(child, this.children.length);
		},

		addChildAt : function(child, index) {
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
		},

		removeChild : function(child) {
			if(child instanceof Node && this.hasChild(child)) {
				this.removeChildAt(this.children.indexOf(child));
			}
		},

		removeChildAt : function(index) {
			if(index < 0 || index >= this.children.length) {
				console.log('index out of bounds');
				return;
			}
			this.children[index].parent = null;
			this.children.splice(index, 1);
		},

		hasChild : function(child) {
			return this.children.indexOf(child) !== -1;
		},

		getChildren : function() {
			return this.children;
		},

		getChild : function(child) {
			var index = this.children.indexOf(child);
			return (index !== -1) ? this.children[index] : undefined;
		},

		getChildAt : function(index) {
			if(index < 0 || index >= this.children.length) {
				console.log('index out of bounds');
				return;
			}
			return this.children[index];
		}

	};

// expose
	return Node;

});

herman.namespace("Sprite",function(){

    /**
     * Canvas Node
     * @constructor
     */
    function Sprite(bitmap) {
        herman.Node.call(this);
        this.bitmap = bitmap;
    }

// proto
    var _p = herman.inherits(Sprite, herman.Node);

    //TODO custom draw method
    _p.draw = function(context) {
        var matrix = this.getMatrix();
        context.save();
        context.setTransform(matrix.a11, matrix.a21, matrix.a12, matrix.a22, matrix.a13, matrix.a23);
        context.drawImage(this.bitmap, -this.bitmap.width/2, -this.bitmap.height/2);
        context.restore();
    }

    _p.update = function(context) {
        this.draw(context);
        
        // update children
        this.children.forEach(function(element){
            element.update(context);
        });
    }

    return Sprite;

});


herman.namespace("Text",function(){

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

    _p.update = function(context) {
        this.draw(context);
    };

    return Text;

});
