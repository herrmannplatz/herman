
function init() {

	// dom
	(function(){

		// stats
		var stats = new Stats();
		stats.setMode(1); 
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		document.body.appendChild( stats.domElement );

		// nodes		
		var stage = new herman.DomNode(document.getElementById("domStage"));
		stage.tag = "stage";

		var nodes = [];
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

		// spinning
		var counter = 0;
		function update(){
			stats.begin();
			for( var i = 0; i < nodes.length; i++ ) {
				nodes[i].rotate((counter++/100)%360);
				nodes[i].update();
			}			
			requestAnimFrame(update);
			stats.end();
		}
		requestAnimFrame(update);
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
