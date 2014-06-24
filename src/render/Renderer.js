
herman.namespace('Renderer', function() {
    "use strict";  

    /**
     * TODO: init with config
     * @param {HTMLCanvasElement} canvas 
     */
    function Renderer(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d"); 
        //this.context.webkitImageSmoothingEnabled = false;

        this.width = canvas.width;
        this.height = canvas.height;

        // this.canvas.width = this.width/2;
        // this.canvas.style.width = this.width + 'px';
        // this.canvas.height = this.height/2;
        // this.canvas.style.height = this.height + 'px';
    }

    Renderer.prototype = {
        
        /**
         * trigger node update
         */
        update: function(node) {
            // clear
            //this.canvas.width = this.canvas.width;
            //this.context.fillStyle = '#FFFFFF';
            //this.context.fillRect(0, 0, this.width, this.height);
            this.context.clearRect(0, 0, this.width, this.height);
            
            // draw into buffer
            node.update(this.context);
        }
        
    };

    return Renderer;

});