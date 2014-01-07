
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