var Node = require('./node');

class Text extends Node {
    
    /**
     * Text Node
     * @constructor
     */
    constructor(text) {
        super();
        this.text = text;
    }

    draw(context) {
        context.fillStyle = "#00F";
        context.font = "italic 30pt Arial";
        context.fillText(this.text, 20, 50);
    }

}

module.exports = Text;
