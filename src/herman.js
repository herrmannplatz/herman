
window.herman = window.herman || {};

(function(herman) {

    herman.VERSION = 0.1;

    /**
     * create namespace
     * @param  {string} namespace 
     */
    herman.namespace = function(namespace, func) {
        var ns = namespace.split('.'); // 'canvas.Node'
        var module = ns.pop(); // 'Node'
        var o = herman; 

        if(ns[0] === 'herman') {
            ns.shift();
        }

        for(var i = 0; i < ns.length; i++){
            o = o[ns[i]] = o[ns[i]] || {};
        } 
        o[module] = func.call(this);
    };

    /**
     * prototypical inheritance helper
     * @param  {Object} child  
     * @param  {Object} parent
     * @return {Object}        
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