
// herman.namespace("DomNode",function(){

//  /**
//   * Dom Node
//   * @param {HTMLDivElement} element
//   */
//  function DomNode(element) {
//      herman.Node.call(this); 
        
//      if(!element) {
//          // dev style
//          this.element = document.createElement("div");
//          this.element.className = "div-node";
//          this.element.style.width = '100px';
//          this.element.style.height = '100px';
//          this.element.style.backgroundColor = 'white';
//          this.element.style.border = '1px solid red';
    
//      } else {
//          this.element = element;
//      }   

//      // force gpu rendering
//      this.element.style.webkitPerspective = 1000;
//      this.element.style.webkitBackfaceVisibility = "hidden";
//      // node styles
//      this.element.style.position = "absolute";
//  }

// // proto
//  var _p = herman.inherits(DomNode, herman.Node);

//  _p.update = function() {
//      var matrix = this.getMatrix();

//      // TODO cross browser
//      this.element.style.webkitTransform = 'matrix(' + matrix.a11 + ',' + matrix.a21 + ',' + matrix.a12 + ',' + matrix.a22 + ',' + matrix.a13 + ',' + matrix.a23 + ')';   
        
//      // update children
//      for (var i = 0; i < this.children.length; i++) {
//          this.children[i].update();
//      }
//  }

// // scene
//  _p.addChild = function(child) {
        
//      this.super.addChild.apply(this,arguments); // super
//      child.update();
//      //TODO use stage reference
//      document.getElementById('domStage').appendChild(child.element);
//  };

//  _p.removeChild = function(child) {
//      this.super.removeChild.apply(this,arguments); // super
//      //TODO use stage reference
//      document.getElementById('domStage').removeChild(child.element);
//  };

//  return DomNode;

// });
