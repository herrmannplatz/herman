
herman.namespace('Vector',function(){
    "use strict"

    /**
     * Vector
     * @constructor
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector.prototype = {
        
        add: function(x,y ) {
            this.x += x;
            this.y += y;
        }
        
    };

    return Vector;

});