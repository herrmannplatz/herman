$(function(){

	window.updateMatrix = function(m) {
		$('#d').css({
			transform : 'matrix(' + m.a11 + ',' + m.a21 + ',' + m.a12 + ',' + m.a22 + ',' + m.a13 + ',' + m.a23 + ')'
		})
	}

	var m = new herman.Matrix();
	m.translate(10,10);
	updateMatrix(m);

});
