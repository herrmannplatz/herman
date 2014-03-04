
herman.createModule('Renderer',function(){
    "use strict"  

    /**
     * [Renderer description]
     * @param {[type]} canvas [description]
     */
    function Renderer(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");  
    }

    Renderer.prototype = {
        
        /**
         * [update description]
         * @param  {[type]} node [description]
         * @return {[type]}      [description]
         */
        update: function(node) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            node.update(this.context);
        }
        
    };

    return Renderer;

});