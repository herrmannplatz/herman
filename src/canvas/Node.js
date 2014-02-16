
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
