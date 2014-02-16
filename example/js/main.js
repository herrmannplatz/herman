
		// stats
		window.stats = new Stats();
		stats.setMode(1); 
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		document.body.appendChild( stats.domElement );

function init() {

	// dom
	// (function(){

	// 	function randomBox() {
			
	// 		var element = document.createElement("div");
	// 		element.innerHTML = "Hallo";
	// 		element.className = "node";
	// 		element.style.backgroundColor = '#'+Math.floor(Math.random()*16777215).toString(16);

	// 		var img = new Image();
	// 		img.src = "http://placekitten.com/g/80/80";
	// 		element.appendChild(img);
	// 		return element;

	// 	}

	// 	// nodes		
	// 	stage = new herman.DomNode(document.getElementById("domStage"));
	// 	stage.tag = "stage";

	// 	// dev
	// 	window.stage = stage;
	// 	window.randomBox = randomBox;
	// 	window.run = true;
	// 	//return;

	// 	var nodes = [];
	// 	for( var i = 0; i < 150; i++ ) {				
			
	// 		var node = new herman.DomNode(randomBox());
	// 		node.width = 100;
	// 		node.height = 100;
	// 		node.x = Math.random() * stage.element.offsetWidth;
	// 		node.y = Math.random() * stage.element.offsetHeight;
	// 		node.tag = "node" + i;
	// 		stage.addChild(node);	
	// 		nodes.push(node);
	// 	}	

	// 	// spinning
	// 	var counter = 0;
	// 	function update(){
	// 		if(!window.run) return;
	// 		stats.begin();
	// 		for( var i = 0; i < nodes.length; i++ ) {
	// 			nodes[i].rotation = (counter++/100)%360;
	// 		}
	// 		stage.update();			
	// 		requestAnimFrame(update);
	// 		stats.end();
	// 	}
	// 	requestAnimFrame(update);
	// })();

	// canvas
	(function(){

		var canvas = document.getElementById('canvas');
		var context = canvas.getContext("2d");

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		window.stage = new herman.canvas.Node();

		var nodes = [];
		for( var i = 0; i < 150; i++ ) {				
			
			var node = new herman.canvas.Node();
			node.width = 100;
			node.height = 100;
			node.x = Math.random() * canvas.width;
			node.y = Math.random() * canvas.height;
			node.tag = "node" + i;
			stage.addChild(node);	
			nodes.push(node);
		}	

		// spinning
		var counter = 0;
		function update() {
			stats.begin();
			for( var i = 0; i < nodes.length; i++ ) {
				nodes[i].rotation = (counter++/100)%360;
			}
			// clear canvas 
			context.clearRect(0, 0, canvas.width, canvas.height);
			// update stage
			stage.update(context);			
			requestAnimFrame(update);
			stats.end();
		}
		requestAnimFrame(update);

	})();

}
