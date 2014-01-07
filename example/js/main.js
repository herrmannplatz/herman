
function init() {

	// dom
	(function(){
		
		var stage = new herman.DomNode(document.getElementById("domStage"));
		stage.tag = "stage";
		
		var node = new herman.DomNode();
		node.position(100,100);
		node.tag = "node";
		stage.addChild(node);

		var child = new herman.DomNode();
		child.position(10,10);
		child.tag = "child";
		node.addChild(child);

		var counter = 0;
		function update(){
			node.rotate(counter++%360);
			node.update();
			requestAnimFrame(update);
		}
		requestAnimFrame(update);

		//setInterval(update,2000);

		window.update = update;
	})();

	// canvas
	(function(){

		// var canvas = document.getElementById('canvas');

		// var stage = new herman.CanvasNode(canvas);

		// var node = new herman.CanvasNode(canvas);
		// node.position(100,100);
		// stage.addChild(node);

		// var child = new herman.CanvasNode(canvas);
		// child.position(10,10);
		// node.addChild(child);

		// var nodeB = new herman.CanvasNode(canvas);
		// nodeB.position(200,200);
		// nodeB.setScale(2);
		// stage.addChild(nodeB);

	})();

}
