
function init() {

	var image = new Image();
	image.onload = initScene;
	image.src = "img/kugelfisch.png";

	function initScene() {
		var canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		var renderer = new herman.Renderer(canvas);

		var stage = new herman.Node();
		var nodes = [];
		
		for( var i = 0; i < 2000; i++ ) {				
			
			var node = new herman.Sprite(image);
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
			for( var i = 0; i < nodes.length; i++ ) {
				nodes[i].rotation = (counter++/1000)%360;
			}
			renderer.update(stage);		
			requestAnimFrame(update);
		}
		requestAnimFrame(update);	
		}


	

}
