
herman.namespace('Node', function() {
    "use strict";

    /**
     * Node
     * 
     * @class Node
     * @constructor
     */
    function Node() {

        /**
         * [tag description]
         * @type {[type]}
         */
        this.tag = undefined;

        /**
         * parent node
         * @type {[type]}
         */
        this.parent = undefined;

        /**
         * child nodes
         * @type {Array}
         */
        this.children = [];

        /**
         * world transform
         * @type {herman}
         */
        this.matrix = new herman.math.Matrix(); 

        /**
         * [x description]
         * @type {Number}
         */
        this.x = 0;

        /**
         * [y description]
         * @type {Number}
         */
        this.y = 0;

        /**
         * [scale description]
         * @type {Number}
         */
        this.scale = 1;

        /**
         * [rotation description]
         * @type {Number}
         */
        this.rotation = 0; 

        /**
         * [anchorX description]
         * @type {Number}
         */
        this.anchorX = 0;

        /**
         * [anchorY description]
         * @type {Number}
         */
        this.anchorY = 0;

        /**
         * [width description]
         * @type {Number}
         */
        this.width = 0;

        /**
         * [height description]
         * @type {Number}
         */
        this.height = 0;
    }

    /**
     * [update description]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
    Node.prototype.update = function(context) {  

        // update and draw
        context.save();
            this.updateMatrix(context); 
            this.draw(context);    
        context.restore();   

        // udpate childs
        for ( var i = 0, len = this.children.length; i < len; i++ ) {
            this.children[i].update(context); 
        } 
    };

    /**
     * [draw description]
     * @return {[type]} [description]
     */
    Node.prototype.draw = function(context) {
        // overwrite
    };
        
    /**
     * update world matrix
     */
    Node.prototype.updateMatrix = function(context) {  

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

        // update context transform
        context.setTransform(this.matrix.a11, this.matrix.a21, this.matrix.a12, this.matrix.a22, this.matrix.a13, this.matrix.a23); 
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
            throw new Error('index does not exist');
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
        } else {
            throw new Error('object is not a child');
        }
    };

    /**
     * [removeChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    Node.prototype.removeChildAt = function(index) {
        if(index < 0 || index >= this.children.length) {
            throw new Error('index does not exist');
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
     * [getChildByTagName description]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    Node.prototype.getChildByTagName = function(name) {
        // implement
    };

    /**
     * [getChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    Node.prototype.getChildAt = function(index) {
        if(index < 0 || index >= this.children.length) {
            throw new Error('index does not exist');
        }
        return this.children[index];
    };

// expose
    return Node;

});