
herman.namespace('Vector',function(){
    "use strict"

    /**
     * Vector
     * @class Vector
     * @constructor
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    Vector.prototype = {
        
        add: function(vec) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        },

        substract : function(vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        },

        normalize : function() {
            var length = this.length();
            this.x /= length;
            this.y /= length;
            return this;
        },

        dot : function(vec) {
            return this.x * vec.x + this.y * vec.y;
        },

        length : function() {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        }
        
    };

    return Vector;

});