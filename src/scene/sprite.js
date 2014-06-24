
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

    Sprite.prototype.draw = function(context) {      
        context.drawImage(this.bitmap, -this.bitmap.width/2, -this.bitmap.height/2);
    };

    return Sprite;

});
