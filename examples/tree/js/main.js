
function init() {

	var image = new Image();
	image.onload = initScene;
	image.src = "img/kugelfisch.png";

	function initScene() {
		var canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		var renderer = new herman.Renderer(canvas);
		var nodes = [];
		var stage = new herman.Node();
		var root = new herman.Node();
		root.x = canvas.width/2;
		root.y = canvas.height/2;
		root.tag = "root";
		stage.addChild(root);
		nodes.push(root);
		
		for( var i = 0; i < 4; i++ ) {			
			var angle = 360 / 10 * i;	
			var radius = 100;
			var child = new herman.Sprite(image);
			child.x = Math.cos(angle) * radius;
			child.y = Math.sin(angle) * radius;
			child.tag = "child" + i;
			root.addChild(child);	
			nodes.push(child);
		}	

		// spinning
		var counter = 0;
		function update() {
			for( var i = 0; i < nodes.length; i++ ) {
				nodes[i].rotation = (counter++/10)%360;
			}
			renderer.update(stage);		
			requestAnimFrame(update);
		}
		requestAnimFrame(update);	
		}


	

}
