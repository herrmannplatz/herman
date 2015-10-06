var Node = require('./node');

class Sprite extends Node {
    
    /**
     * Sprite
     * 
     * @class Sprite
     * @constructor
     */
    constructor(bitmap) {
        super();
        this.bitmap = bitmap;
    }

    draw(context) {      
        context.drawImage(this.bitmap, -this.bitmap.width/2, -this.bitmap.height/2);
    }

}

module.exports = Sprite;
