
function init() {

	var FISH_COUNT = 2000;

	var stats = new Stats();
	stats.setMode(0); 
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	var counter = document.createElement('span');
	counter.style.position = 'absolute';
	counter.style.right = '0px';
	counter.style.top = '0px';
	counter.style.backgroundColor = 'white';
	counter.innerHTML = FISH_COUNT;
	document.body.appendChild( counter );

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
		
		for( var i = 0; i < FISH_COUNT; i++ ) {				
			
			var node = new herman.Sprite(image);
			node.width = image.width;
			node.height = image.height;
			node.x = Math.random() * canvas.width;
			node.y = Math.random() * canvas.height;
			node.tag = "node" + i;
			stage.addChild(node);	
			nodes.push(node);
		}	

		// spinning
		var counter = 0;
		var i;
		function update() {
			stats.begin();
			for( i = 0; i < nodes.length; i++ ) {
				nodes[i].rotation = (counter++/1000)%360;
			}
			renderer.update(stage);		
			requestAnimFrame(update);
			stats.end();
		}
		requestAnimFrame(update);	
	}
}
