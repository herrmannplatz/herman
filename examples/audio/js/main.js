
function init() {

	var backgroundNodes = document.querySelectorAll('.sound-item.sound-item-background');
	var backgroundItems = Array.prototype.slice.call(backgroundNodes);
	var backgroundMusic = herman.audio.AudioPlayer.background;

	backgroundItems.forEach(function(item) {
		var file = item.getAttribute('data-file');		
		var sound = null;
		item.addEventListener('click', function(e) {
			var button = e.target.innerHTML;
			if(button === 'play') {
				backgroundMusic.play(file, true);					
			}
			if(button === 'pause') {
				backgroundMusic.pause();
			}
			if(button === 'resume') {
				backgroundMusic.resume();
			}
			if(button === 'stop') {
				backgroundMusic.stop();
			}
		});
	});
}
