
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
