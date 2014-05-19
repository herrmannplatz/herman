
herman.namespace("Sprite", function() {
    "use strict";
    
    /**
     * Sprite
     * 
     * @class Sprite
     * @constructor
     */
    function Sprite(bitmap) {
        herman.Node.call(this);
        this.bitmap = bitmap;
    }

// proto
    herman.inherits(Sprite, herman.Node);

    //TODO custom draw method
    Sprite.prototype.draw = function(context) {
        var matrix = this.matrix;
        //context.save();
            context.setTransform(matrix.a11, matrix.a21, matrix.a12, matrix.a22, matrix.a13, matrix.a23);
            context.drawImage(this.bitmap, -this.bitmap.width/2, -this.bitmap.height/2);
        //context.restore();
    };

    return Sprite;

});
