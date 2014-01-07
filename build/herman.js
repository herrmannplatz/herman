
window.herman = window.herman || {};

(function(herman) {

	herman.VERSION = 0.1;

	/**
	 * [namespace description]
	 * @param  {[type]} namespace [description]
	 * @return {[type]}           [description]
	 */
	herman.createModule = function(namespace, func) {
		var ns = namespace.split('.');
		var module = ns.pop();

		if(ns.length > 1) {			
			var o = herman;

			if(ns[0] === 'herman') {
				ns.shift();
			}

			for(var i = 0; i < ns.length; i++){
				o = o[ns[i]] = o[ns[i]] || {};
			}	
		} 
		herman[module] = func.call(this);
	};

	/**
	 * [inherits description]
	 * @param  {[type]} child  [description]
	 * @param  {[type]} parent [description]
	 * @return {[type]}        [description]
	 */
	herman.inherits = function inheritPrototype(child, parent) {
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

	var ACCURACY = 15;

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
			this.a13 += tx;
			this.a23 += ty;
			return this;
		},

		/**
		 * [rotate description]
		 * @param  {Number} angle radians
		 * @return {[type]}
		 */
		rotate : function(angle) {
			angle = (angle*DEG_TO_RAD).toFixed(ACCURACY); // or use radians?
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

herman.createModule('Node',function(){

	/**
	 * [Node description]
	 */
	function Node() {
		this.tag = null;
		this.stage = null;
		this.parent = null;
		this.children = [];
		// geom (private ?)
		this.matrix = new herman.Matrix(); // calculate on the fly
		this.x = 0;
		this.y = 0;
		this.scale = 1;
		this.rotation = 0; 
		this.visible = true;
	}

// prototype
	Node.prototype = {

		// geom
		
		getMatrix : function() {	
			//this.matrix.identity(); // clear		
			this.matrix = new herman.Matrix().transform(this.x,this.y, this.rotation, this.scale); // avoid new matrix
			
			if (this.parent) {
				this.matrix = this.parent.getMatrix().multiply(this.matrix); //TODO use loop ?
			} 
			return this.matrix;
		},
		
		position : function(x,y) {
			this.x = x;
			this.y = y;
		},	

		rotate : function(angle) {
			this.rotation = angle;
		},	

		setScale : function(scale) {
			this.scale = scale;
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

herman.createModule("herman.DomNode",function(){

	/**
	 * [DomNode description]
	 * @param {[type]} element [description]
	 */
	function DomNode(element) {
		herman.Node.call(this); // avoid
		// this.element = element || $('<div/>');
		if(!element) {
			this.element = document.createElement("div");
			this.element.className = "node";	
		} else {
			this.element = element;
		}		
	}

// proto
	var _p = herman.inherits(DomNode, herman.Node);

	_p.update = function() {
		var matrix = this.getMatrix();

		// TODO cross browser
		if(this.element.style) {
			this.element.style.webkitTransform = 'matrix(' + matrix.a11 + ',' + matrix.a21 + ',' + matrix.a12 + ',' + matrix.a22 + ',' + matrix.a13 + ',' + matrix.a23 + ')';	
		}
		
		// update children
		this.children.forEach(function updateChildren(element){
			element.update();
		});
	}

// scene
	_p.addChild = function(child) {
		
		this.super.addChild.apply(this,arguments); // super
		child.update();
		//TODO use stage reference
		document.getElementById('domStage').appendChild(child.element);
	};

	_p.removeChild = function(child) {
		this.super.addChild.apply(this,arguments); // super
		//TODO remove
	};

	return DomNode;

});


herman.createModule("herman.CanvasNode",function(){

	/**
	 * [Node description]
	 */
	function CanvasNode(canvas) {
		Node.call(this);
		this.context = canvas.getContext("2d");
	}

// proto
	var _p = herman.inherits(CanvasNode, herman.Node);

	//TODO custom draw method
	_p.draw = function() {
		var matrix = this.getMatrix();
		this.context.save();
        this.context.setTransform(matrix.a11, matrix.a21, matrix.a12, matrix.a22, matrix.a13, matrix.a23);
        this.context.fillStyle = "rgb(200,0,0)";
        this.context.fillRect (10, 10, 55, 50);
        this.context.restore();
	}

	_p.update = function() {
		this.draw();
		
		// update children
		this.children.forEach(function(element){
			element.update();
		});
	}

	// geom	
	_p.position = function(x,y) {
		_s.position.apply(this,arguments); // super
		if(this.parent) {
			this.update(); 
		}
	};	

	_p.rotate = function(angle) {
		_s.rotate.apply(this,arguments); // super
		if(this.parent) {
			this.update(); 
		}
	};	

	_p.setScale = function(scale) {
		_s.setScale.apply(this,arguments); // super
		if(this.parent) {
			this.update(); 
		}
	};	

	// scene
	_p.addChild = function(child) {
		_s.addChild.apply(this,arguments); // super
		child.update();
	};

	return CanvasNode;

});
