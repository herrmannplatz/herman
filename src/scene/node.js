
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
		this.matrix = new herman.math.Matrix(); // calculate on the fly
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
			this.matrix = new herman.math.Matrix().transform(this.x + this.anchorX,this.y + this.anchorY, this.rotation, this.scale); // avoid new matrix

			if (this.parent) {
				this.matrix = this.parent.getMatrix().multiply(this.matrix); //TODO use loop ?
			} 
			return this.matrix;
		},

		localToGlobal : function(x, y) {
			var mat = this.getMatrix();
			mat.translate(x, y);
			return new herman.math.Vector(mat.a13, mat.a23);

		},

		globalToLocal : function(x, y) {
			// get mat, invert mat, append x,y
			var mat = this.getMatrix();
			return new herman.math.Vector(x - mat.a13, y - mat.a23); // 600, 600 node 300, 300 -> 10, 10
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