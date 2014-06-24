
herman.namespace("DomNode",function(){

 /**
  * Dom Node
  * @param {HTMLDivElement} element
  */
 function DomNode(element) {
     herman.Node.call(this);
        
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

// proto
    herman.inherits(DomNode, herman.Node);

    DomNode.prototype.update = function() {  

        // update and draw
        this.updateMatrix(); 
        this.draw();     

        // udpate childs
        for ( var i = 0, len = this.children.length; i < len; i++ ) {
            this.children[i].update(); 
        } 
    };

    DomNode.prototype.updateMatrix = function() {
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
    };

// scene
     DomNode.prototype.addChild = function(child) {
            
         this.super.addChild.apply(this,arguments); // super
        
         //TODO use stage reference
         this.updateMatrix();
         document.getElementById('domStage').appendChild(child.element);
     };

     DomNode.prototype.removeChild = function(child) {
         this.super.removeChild.apply(this,arguments); // super
         //TODO use stage reference
         document.getElementById('domStage').removeChild(child.element);
     };

     return DomNode;

});
