
herman.namespace('Renderer',function(){
    "use strict"  

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    function Renderer(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");  
    }

    Renderer.prototype = {
        
        /**
         * trigger node update
         */
        update: function(node) {
            // clear
            this.canvas.width = this.canvas.width;
            
            // draw into buffer
            node.update(this.context);
        }
        
    };

    return Renderer;

});