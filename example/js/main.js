
function init() {

	// dom
	(function(){

		var nodes = [];
		
		var stage = new herman.DomNode(document.getElementById("domStage"));
		stage.tag = "stage";

		for( var i = 0; i < 100; i++ ) {
			
			var element = document.createElement("div");
			element.innerHTML = "Hallo";
			element.className = "node";
			element.style.backgroundColor = '#'+Math.floor(Math.random()*16777215).toString(16);
			
			var node = new herman.DomNode(element);
			node.position(Math.random()*stage.element.offsetWidth,Math.random()*stage.element.offsetHeight);
			node.tag = "node" + i;
			stage.addChild(node);	
			nodes.push(node);
		}	

		var counter = 0;
		function update(){
			for( var i = 0; i < nodes.length; i++ ) {
				nodes[i].rotate((counter++/100)%360);
				nodes[i].update();
			}			
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
