
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