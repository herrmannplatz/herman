
window.herman = window.herman || {};

(function(herman) {

    herman.VERSION = 0.1;

    /**
     * [namespace description]
     * @param  {[type]} namespace [description]
     * @return {[type]}           [description]
     */
    herman.createModule = function(namespace, func) {
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
     * [inherits description]
     * @param  {[type]} child  [description]
     * @param  {[type]} parent [description]
     * @return {[type]}        [description]
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

})(window.herman);

herman.createModule('Matrix',function(){

	// TODO scaleX, scaleY or scaleNonUniform

	var DEG_TO_RAD = Math.PI/180;

	var PRECISION = 5;

	/**
	 * 3x3 Matrix
	 * @constructor
	 *
	 * | a11 a12 a13 |
	 * | a21 a22 a23 |
	 * | a31 a32 a33 |
	 * 
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
		 * @param  {[type]} tx
		 * @param  {[type]} ty
		 * @return {[type]}
		 */
		translate : function(tx, ty) {
			this.a13 += tx; //Math.round(tx); // tx | 0;
			this.a23 += ty; //Math.round(ty); // ty | 0;
			return this;
		},

		/**
		 * [rotate description]
		 * @param  {Number} angle radians
		 * @return {[type]}
		 */
		rotate : function(angle) {
			angle = (angle*DEG_TO_RAD).toFixed(PRECISION); // or use radians?
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
		 * @param  {[type]} scale
		 * @return {[type]}
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
		 * @param  {[type]} tx    [description]
		 * @param  {[type]} ty    [description]
		 * @param  {[type]} angle [description]
		 * @param  {[type]} scale [description]
		 * @return {[type]}       [description]
		 */
		transform : function(tx, ty, angle, scale) {
			return this.translate(tx, ty).rotate(angle).scale(scale); // TxRxS
		},

		/**
		 * [multiply description]
		 * @param  {[type]} m
		 * @return {[type]}
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

		/**
		 * [identity description]
		 * @return {[type]} [description]
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
		 * @return {[type]}
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

herman.createModule('Vector',function(){
    "use strict"

    /**
     * Vector
     * @constructor
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector.prototype = {
        
    };

    return Vector;

});

herman.createModule('Tween',function(){
    "use strict"

    /**
     * [Tween description]
     * @param {[type]} target   [description]
     * @param {[type]} property [description]
     * @param {[type]} begin    [description]
     * @param {[type]} end      [description]
     * @param {[type]} duration [description]
     */
    function Tween(target, property, begin, end, duration) {
        var startTime = new Date().getTime(),
            diff, progress, value;

        (function update() {
            stats.begin();
            diff = new Date().getTime() - startTime;
            progress = diff/duration;
            progress = progress < 1 ? progress : 1;
            value = begin + ( ( end - begin ) * progress );
            target[property] = value;
            target.update();

            if (progress < 1) {
                requestAnimationFrame(update);    
            }
            stats.end();
        })();
    }

    return Tween;

});

herman.createModule('Node',function(){

	/**
	 * [Node description]
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

		// geom
		
		getMatrix : function() {	
			//this.matrix.identity(); // clear		
			this.matrix = new herman.Matrix().transform(this.x + this.anchorX,this.y + this.anchorY, this.rotation, this.scale); // avoid new matrix

			if (this.parent) {
				this.matrix = this.parent.getMatrix().multiply(this.matrix); //TODO use loop ?
			} 
			return this.matrix;
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

herman.createModule("dom.Node",function(){
	//TODO composition

	/**
	 * [DomNode description]
	 * @param {[type]} element [description]
	 */
	function Node(element) {
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
	var _p = herman.inherits(Node, herman.Node);

	_p.update = function() {
		var matrix = this.getMatrix();

		// TODO cross browser
		this.element.style.webkitTransform = 'matrix(' + matrix.a11 + ',' + matrix.a21 + ',' + matrix.a12 + ',' + matrix.a22 + ',' + matrix.a13 + ',' + matrix.a23 + ')';	
		
		// update children
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].update();
		}
	}

// scene
	_p.addChild = function(child) {
		
		this.super.addChild.apply(this,arguments); // super
		child.update();
		//TODO use stage reference
		document.getElementById('domStage').appendChild(child.element);
	};

	_p.removeChild = function(child) {
		this.super.removeChild.apply(this,arguments); // super
		//TODO use stage reference
		document.getElementById('domStage').removeChild(child.element);
	};

	return Node;

});


herman.createModule("canvas.Node",function(){

	/**
	 * [Node description]
	 */
	function Node() {
		herman.Node.call(this);
		this.backgroundColor = '#'+Math.floor(Math.random()*16777215).toString(16);
	}

// proto
	var _p = herman.inherits(Node, herman.Node);

	//TODO custom draw method
	_p.draw = function(context) {
		var matrix = this.getMatrix();
		context.save();
        context.setTransform(matrix.a11, matrix.a21, matrix.a12, matrix.a22, matrix.a13, matrix.a23);
        context.fillStyle = this.backgroundColor;
        context.fillRect (-50, -50, 100, 100);
        context.restore();
	}

	_p.update = function(context) {
		this.draw(context);
		
		// update children
		this.children.forEach(function(element){
			element.update(context);
		});
	}

	return Node;

});
