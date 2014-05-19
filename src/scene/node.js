
herman.namespace('Node', function() {
    "use strict";

    /**
     * Node
     * 
     * @class Node
     * @constructor
     */
    function Node() {
        this.tag = undefined;
        this.stage = undefined;
        this.parent = undefined;
        this.children = [];

        // world transform
        this.matrix = new herman.math.Matrix(); 

        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.rotation = 0; 

        // anchor 0-1 or px
        this.anchorX = 0;
        this.anchorY = 0;

        // w/h
        this.width = 0;
        this.height = 0;
    }

    /**
     * [update description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
    Node.prototype.update = function(context) {  
        this.updateMatrix(); 
        this.draw(context);
        this.children.forEach(function(element) {
            element.update(context);
        });
    };

    /**
     * [draw description]
     * @return {[type]} [description]
     */
    Node.prototype.draw = function(context) {
        
    };
        
    /**
     * update world matrix
     */
    Node.prototype.updateMatrix = function() {  
        this.matrix.identity().transform(
            this.x + this.anchorX,
            this.y + this.anchorY, 
            this.rotation, 
            this.scale
        );

        if(this.parent) {
            this.matrix.preMultiply(this.parent.matrix);    
        } 
    };

    /**
     * [localToGlobal description]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    Node.prototype.localToGlobal = function(x, y) {
        var m = this.matrix.clone();
        m.translate(x, y);
        return new herman.math.Vector(m.a13, m.a23);
    };

    /**
     * [globalToLocal description]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    Node.prototype.globalToLocal = function(x, y) {
        // get mat, invert mat, append x,y
        var m = this.matrix.clone();
        return new herman.math.Vector(x - m.a13, y - m.a23); // 600, 600 node 300, 300 -> 10, 10
    };

    /**
     * [addChild description]
     * @param {[type]} child [description]
     */
    Node.prototype.addChild = function(child) {
        this.addChildAt(child, this.children.length);
    };

    /**
     * [addChildAt description]
     * @param {[type]} child [description]
     * @param {[type]} index [description]
     */
    Node.prototype.addChildAt = function(child, index) {
        if(index < 0 || index > this.children.length) {
            console.log('index out of bounds');
            return;
        }
        if(child instanceof Node && !this.hasChild(child)) {
            if(child.parent) { 
                child.parent.removeChild(child);
            }
            this.children.splice(index, 0, child);
            child.parent = this;    
        }
    };

    /**
     * [removeChild description]
     * @param  {[type]} child [description]
     * @return {[type]}       [description]
     */
    Node.prototype.removeChild = function(child) {
        if(child instanceof Node && this.hasChild(child)) {
            this.removeChildAt(this.children.indexOf(child));
        }
    };

    /**
     * [removeChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    Node.prototype.removeChildAt = function(index) {
        if(index < 0 || index >= this.children.length) {
            console.log('index out of bounds');
            return;
        }
        this.children[index].parent = null;
        this.children.splice(index, 1);
    };

    /**
     * [hasChild description]
     * @param  {[type]}  child [description]
     * @return {Boolean}       [description]
     */
    Node.prototype.hasChild = function(child) {
        return this.children.indexOf(child) !== -1;
    };

    /**
     * [getChildren description]
     * @return {[type]} [description]
     */
    Node.prototype.getChildren = function() {
        return this.children;
    };

    /**
     * [getChild description]
     * @param  {[type]} child [description]
     * @return {[type]}       [description]
     */
    Node.prototype.getChild = function(child) {
        var index = this.children.indexOf(child);
        return (index !== -1) ? this.children[index] : undefined;
    };

    /**
     * [getChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    Node.prototype.getChildAt = function(index) {
        if(index < 0 || index >= this.children.length) {
            console.log('index out of bounds');
            return;
        }
        return this.children[index];
    };

// expose
    return Node;

});