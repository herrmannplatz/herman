
herman.namespace("Sprite", function() {
    "use strict";
    
    /**
     * Canvas Node
     * @constructor
     */
    function Sprite(bitmap) {
        herman.Node.call(this);
        this.bitmap = bitmap;
    }

// proto
    var _p = herman.inherits(Sprite, herman.Node);

    //TODO custom draw method
    _p.draw = function(context) {
        var matrix = this.getMatrix();
        context.save();
        context.setTransform(matrix.a11, matrix.a21, matrix.a12, matrix.a22, matrix.a13, matrix.a23);
        context.drawImage(this.bitmap, -this.bitmap.width/2, -this.bitmap.height/2);
        context.restore();
    };

    _p.update = function(context) {
        this.draw(context);
        
        // update children
        this.children.forEach(function(element){
            element.update(context);
        });
    };

    return Sprite;

});
