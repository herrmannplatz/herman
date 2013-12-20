
window.herman = window.herman || {};

(function(herman) {

	// TODO inheritance pattern

})(window.herman);

window.herman = window.herman || {};

(function(herman) {

	// TODO chaining?

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
	herman.Matrix = function() {
		//TODO param
		this.a11 = 1;
		this.a12 = 0;
		this.a13 = 0;
		this.a21 = 0;
		this.a22 = 1;
		this.a23 = 0;
		this.a31 = 0; // remove?
		this.a32 = 0; // remove?
		this.a33 = 1; // remove?
	}

	herman.Matrix.prototype = {
		
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
		 * @param  {Number} angle
		 * @return {[type]}
		 */
		rotate : function(angle) {
			angle = angle*DEG_TO_RAD; // or use radians?
			var sin = Math.sin(angle).toFixed(ACCURACY);
			var cos = Math.cos(angle).toFixed(ACCURACY);

			var a11 = this.a11;
			// var a12 = this.a12; // remove?
			// var a13 = this.a13;
			var a21 = this.a21;
			// var a22 = this.a22; // remove?
			// var a23 = this.a23;
			// var a31 = this.a31;
			// var a32 = this.a32;
			// var a33 = this.a33;

			this.a11 = (cos*a11) + (sin*this.a12); //+ (0*a13);
			this.a12 = (-sin*a11) + (cos*this.a12); // + (0*a13);
			// this.a13 = (0*a11) + (0*a12) + (1*a13); 
			this.a21 = (cos*a21) + (sin*this.a22);//  + (0*a23);
			this.a22 = (-sin*a21) + (cos*this.a22);//  + (0*a23);
			// this.a23 = (0*a21) + (0*a22) + (1*a23); 
			// this.a31 = (cos*a31) + (sin*a32) + (0*a33);
			// this.a32 = (-sin*a31) + (cos*a32) + (0*a33);
			// this.a33 = (0*a31) + (0*a32) + (1*a33); 
			return this;
		},

		/**
		 * [scale description]
		 * @param  {[type]} scale
		 * @return {[type]}
		 */
		scale : function(scale) {
			// var a11 = this.a11;
			// var a12 = this.a12; 
			// var a13 = this.a13;
			// var a21 = this.a21;
			// var a22 = this.a22;
			// var a23 = this.a23;
			// var a31 = this.a31;
			// var a32 = this.a32;
			// var a33 = this.a33;

			this.a11 *= scale; // this.a11 = (scale*a11) + (0*a12)+ (0*a13);
			this.a12 *= scale; // this.a12 = (0*a11) + (scale*a12) + (0*a13); 
			// this.a13 = (0*a11) + (0*a12) + (1*a13);
			this.a21 *= scale; // this.a21 = (scale*a21) + (0*a22) + (0*a23);
			this.a22 *= scale; // this.a22 = (0*a21) + (scale*a22) + (0*a23);
			// this.a23 = (0*a21) + (0*a22) + (1*a23);
			// this.a31 = (scale*a31) + (0*a32) + (0*a33);
			// this.a32 = (0*a31) + (scale*a32) + (0*a33);
			// this.a33 = (0*a31) + (0*a32) + (1*a33);
			return this;
		},

		/**
		 * [scaleNonUniform description]
		 * @param  {[type]} scaleX [description]
		 * @param  {[type]} scaleY [description]
		 * @return {[type]}        [description]
		 */
		scaleNonUniform : function(scaleX, scaleY) {
			// TODO
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
			return this.translate(tx, ty).rotate(angle).scale(scale);
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
			var a13 = this.a13;
			var a21 = this.a21;
			var a22 = this.a22;
			var a23 = this.a23;
			var a31 = this.a31; // 0
			var a32 = this.a32; // 0
			var a33 = this.a33; // 1

			this.a11 = (a11*m.a11) + (a12*m.a21) + (a13*m.a31);
			this.a12 = (a11*m.a12) + (a12*m.a22) + (a13*m.a32); 
			this.a13 = (a11*m.a13) + (a12*m.a23) + (a13*m.a33); 

			this.a21 = (a21*m.a11) + (a22*m.a21) + (a23*m.a31);
			this.a22 = (a21*m.a12) + (a22*m.a22) + (a23*m.a32);
			this.a23 = (a21*m.a13) + (a22*m.a23) + (a23*m.a33);

			this.a31 = (a31*m.a11) + (a32*m.a21) + (a33*m.a31);
			this.a32 = (a31*m.a12) + (a32*m.a22) + (a33*m.a32);
			this.a33 = (a31*m.a13) + (a32*m.a23) + (a33*m.a33);
			return this;
		},

		/**
		 * [toString description]
		 * @return {[type]}
		 */
		log : function() {
			return 	this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' +  
					this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + 
					this.a31 + ' ' + this.a32 + ' ' + this.a33 + '\n';
		}

	};

})(window.herman);

window.herman = window.herman || {};

(function(herman) {

	/**
	 * [Node description]
	 */
	function Node() {
		this.tag = null;
		this.parent = null;
		this.children = [];
		// geom (private ?)
		this.matrix = new herman.Matrix(); // calculate on the fly
		this.x = 0;
		this.y = 0;
		this.scale = 1;
		this.rotation = 0; 
	}

// expose
	herman.Node = Node;

// prototype
	var _p = Node.prototype;

	// geom
	
	_p.getMatrix = function() {
		this.matrix = new herman.Matrix().transform(this.x,this.y, this.rotation, this.scale);
		if (this.parent) {
			this.matrix = this.parent.getMatrix().multiply(this.matrix);	
		} 
		return this.matrix
	},
	
	_p.position = function(x,y) {
		this.x = x;
		this.y = y;
	};	

	_p.rotate = function(angle) {
		this.rotation = angle;
	};	

	_p.setScale = function(scale) {
		this.scale = scale;
	};	

	// scene graph
		
	_p.addChild = function(child) {
		this.addChildAt(child, this.children.length);
	};

	_p.addChildAt = function(child, index) {
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

	_p.removeChild = function(child) {
		if(child instanceof Node && this.hasChild(child)) {
			this.removeChildAt(this.children.indexOf(child));
		}
	};

	_p.removeChildAt = function(index) {
		if(index < 0 || index >= this.children.length) {
			console.log('index out of bounds');
			return;
		}
		this.children[index].parent = null;
		this.children.splice(index, 1);
	};

	_p.hasChild = function(child) {
		return this.children.indexOf(child) !== -1;
	};

	_p.getChildren = function() {
		return this.children;
	};

	//TODO include children?
	_p.getChild = function(child) {
		var index = this.children.indexOf(child);
		return (index !== -1) ? this.children[index] : undefined;
	};

	_p.getChildAt = function(index) {
		if(index < 0 || index >= this.children.length) {
			console.log('index out of bounds');
			return;
		}
		return this.children[index];
	};

})(window.herman);

window.herman = window.herman || {};

(function(herman) {

	/**
	 * [Node description]
	 */
	function DomNode(element) {
		herman.Node.call(this); // avoid
		this.element = element || $('<div/>');
	}

// extend
	herman.DomNode = DomNode;

// super
	var _s = herman.Node.prototype;

// proto
	var _p = DomNode.prototype = new herman.Node();

	_p.update = function() {
		//TODO update children
		var matrix = this.getMatrix();
		
		// update transform
		this.element.css({
			transform : 'matrix(' + matrix.a11 + ',' + matrix.a21 + ',' + matrix.a12 + ',' + matrix.a22 + ',' + matrix.a13 + ',' + matrix.a23 + ')'
		});
		
		// update children
		this.children.forEach(function updateChildren(element){
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
		$('.dom.stage').append(child.element);
		//this.element.append(child.element);
	};

	_p.removeChild = function(child) {
		_s.addChild.apply(this,arguments); // super
		child.element.remove();
	};

})(window.herman);


window.herman = window.herman || {};

(function(herman) {

	// aliases
	var Node = herman.Node;

	/**
	 * [Node description]
	 */
	function CanvasNode(canvas) {
		Node.call(this);
		this.context = canvas.getContext("2d");
	}

// expose
	herman.CanvasNode = CanvasNode;

// super
	var _s = Node.prototype;

// proto
	var _p = CanvasNode.prototype = new Node();

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


})(window.herman);
