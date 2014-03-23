
herman.namespace("Text",function(){

    /**
     * Text Node
     * @constructor
     */
    function Text(text) {
        herman.Node.call(this);
        this.text = text;
    }

// proto
    var _p = herman.inherits(Text, herman.Node);

    //TODO custom draw method
    _p.draw = function(context) {
        var matrix = this.getMatrix();
        context.save();
            context.setTransform(matrix.a11, matrix.a21, matrix.a12, matrix.a22, matrix.a13, matrix.a23);
            context.fillStyle = "#00F";
            context.font = "italic 30pt Arial";
            context.fillText(this.text, 20, 50);
        context.restore();
    };

    _p.update = function(context) {
        this.draw(context);
    };

    return Text;

});
