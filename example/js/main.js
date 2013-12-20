$(function(){

	// dom
	(function(){
		
		var stage = new herman.DomNode($('.dom.stage'));

		var node = new herman.DomNode($('<div class="node"></div>'));
		node.position(100,100);
		node.setScale(2);
		stage.addChild(node);

		var child = new herman.DomNode($('<div class="node"></div>'));
		child.position(10,10);
		node.addChild(child);
	})();

	// canvas
	(function(){

		var canvas = document.getElementById('canvas');

		var stage = new herman.CanvasNode(canvas);

		var node = new herman.CanvasNode(canvas);
		node.position(100,100);
		stage.addChild(node);

		var child = new herman.CanvasNode(canvas);
		child.position(10,10);
		node.addChild(child);

		var nodeB = new herman.CanvasNode(canvas);
		nodeB.position(200,200);
		nodeB.setScale(2);
		stage.addChild(nodeB);

	})();


});
