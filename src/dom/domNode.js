
herman.createModule("herman.DomNode",function(){
	//TODO composition

	/**
	 * [DomNode description]
	 * @param {[type]} element [description]
	 */
	function DomNode(element) {
		herman.Node.call(this); 
		
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
