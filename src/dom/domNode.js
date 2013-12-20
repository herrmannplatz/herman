
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
