
const Node = require('../scene/node');

class DomNode extends Node {

    /**
     * Dom Node
     * @param {HTMLDivElement} element
     */
    constructor(element) {
        super();
        if(!element) {
            // dev style
            this.element = document.createElement("div");
            this.element.className = "div-node";
            this.element.style.width = '100px';
            this.element.style.height = '100px';
            this.element.style.backgroundColor = 'white';
            this.element.style.border = '1px solid red';    
        } else {
            this.element = element;
        }   

        // force gpu rendering
        this.element.style.webkitPerspective = 1000;
        this.element.style.webkitBackfaceVisibility = "hidden";
        // node styles
        this.element.style.position = "absolute";
    }

    update() {  

        // update and draw
        this.updateMatrix(); 
        this.draw();     

        // udpate childs
        for ( var i = 0, len = this.children.length; i < len; i++ ) {
            this.children[i].update(); 
        } 
    }

    updateMatrix() {
        // build local matrix
        this.matrix.identity().transform(
            this.x + this.anchorX,
            this.y + this.anchorY, 
            this.rotation, 
            this.scale
        );

        // apply world matrix 
        // TODO check preMultiply
        if(this.parent) {
            var world = this.parent.matrix.clone();
            this.matrix = world.multiply(this.matrix);    
        } 

        // TODO cross browser
        var matrixString = 'matrix(' + this.matrix.a11 + ',' + this.matrix.a21 + ',' + this.matrix.a12 + ',' + this.matrix.a22 + ',' + this.matrix.a13 + ',' + this.matrix.a23 + ')'; 
        this.element.style.webkitTransform = matrixString;
    }

    addChild(child) {
        super.addChild.apply(this,arguments);
    
        //TODO use stage reference
        this.updateMatrix();
        document.getElementById('domStage').appendChild(child.element);
    }

    removeChild(child) {
        super.removeChild.apply(this,arguments);
        //TODO use stage reference
        document.getElementById('domStage').removeChild(child.element);
    }

}

module.exports = DomNode;
