
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
		var nodes = [];
		var stage = new herman.DomNode();
		var counter = 0;
		
		for( i = 0; i < FISH_COUNT; i++ ) {	
			var fish = new Image();
			fish.src = image.src;							
			var node = new herman.DomNode(fish);
			node.width = fish.width;
			node.height = fish.height;
			node.x = Math.random() * window.innerWidth;
			node.y = Math.random() * window.innerHeight;
			stage.addChild(node);	
			nodes.push(node);
		}

		window.context = {
			save : function() {},
			restore : function() {}
		}

		// spinning
		function update() {
			stats.begin();

			requestAnimationFrame(update);
			
			var rotation = (counter++)%360;

			for( i = 0, len = nodes.length; i < len; i++ ) {
				nodes[i].rotation = rotation;
			}
			stage.update(context);	

			stats.end();
		}
		requestAnimationFrame(update);	
	}
}
