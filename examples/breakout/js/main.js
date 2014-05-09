
function init() {

	var image = new Image();
	image.onload = initScene;
	image.src = "img/kugelfisch.png";

	function initScene() {
		var canvas = document.getElementById('canvas');
		var renderer = new herman.Renderer(canvas);

		var stage = new herman.Node();
		var sprite = new herman.Sprite(image);
		var velocity = new herman.Vector(-2,3);

		sprite.x = canvas.width/2;
		sprite.y = canvas.height/2;
		stage.addChild(sprite);
		renderer.update(stage);	

		function update() {
			
			sprite.x += velocity.x;
			sprite.y += velocity.y;

			if(sprite.x < 0 || sprite.x > canvas.width) {
				velocity.x *= -1;
			} 
			if(sprite.y < 0 || sprite.y > canvas.height) {
				velocity.y *= -1;
			}

			renderer.update(stage);	

			requestAnimFrame(update);
		}
		requestAnimFrame(update);	
	}	

}
