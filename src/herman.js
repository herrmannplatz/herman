
window.herman = window.herman || {};

(function(herman) {

	herman.VERSION = 0.1;

	/**
	 * [namespace description]
	 * @param  {[type]} namespace [description]
	 * @return {[type]}           [description]
	 */
	herman.createModule = function(namespace, func) {
		var ns = namespace.split('.');
		var module = ns.pop();

		if(ns.length > 1) {			
			var o = herman;

			if(ns[0] === 'herman') {
				ns.shift();
			}

			for(var i = 0; i < ns.length; i++){
				o = o[ns[i]] = o[ns[i]] || {};
			}	
		} 
		herman[module] = func.call(this);
	};

	/**
	 * [inherits description]
	 * @param  {[type]} child  [description]
	 * @param  {[type]} parent [description]
	 * @return {[type]}        [description]
	 */
	herman.inherits = function inherits(child, parent) {
	    var o = Object.create(parent.prototype);
	    o.constructor = child;
	    child.prototype = o;
	    child.prototype.super = parent.prototype;
	    return child.prototype;
	};

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
	  	return  window.requestAnimationFrame       ||
	          	window.webkitRequestAnimationFrame ||
	          	window.mozRequestAnimationFrame    ||
	          	function( callback ){
		            window.setTimeout(callback, 1000 / 60);
			};
	})();

})(window.herman);