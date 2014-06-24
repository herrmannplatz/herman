
herman.namespace("Text", function() {
    "use strict";
    
    /**
     * Text Node
     * @constructor
     */
    function Text(text) {
        herman.Node.call(this);
        this.text = text;
    }

// proto
    herman.inherits(Text, herman.Node);

    Text.prototype.draw = function(context) {
        context.fillStyle = "#00F";
        context.font = "italic 30pt Arial";
        context.fillText(this.text, 20, 50);
    };

    return Text;

});
