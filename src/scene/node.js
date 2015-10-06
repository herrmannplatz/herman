const Vector = require('../math/Vector');
const Matrix = require('../math/Matrix');

class Node {

    /**
     * Node
     * 
     * @class Node
     * @constructor
     */
    constructor() {
    
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
        this.matrix = new Matrix(); 

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
    update(context) {  

        // update and draw
        context.save();
            this.updateMatrix(context); 
            this.draw(context);    
        context.restore();   

        // udpate childs
        for ( var i = 0, len = this.children.length; i < len; i++ ) {
            this.children[i].update(context); 
        } 
    }

    /**
     * [draw description]
     * @return {[type]} [description]
     */
    draw(context) {
        // overwrite
    }
        
    /**
     * update world matrix
     */
    updateMatrix(context) {  

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
    }

    /**
     * [localToGlobal description]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    localToGlobal(x, y) {
        var m = this.matrix.clone();
        m.translate(x, y);
        return new Vector(m.a13, m.a23);
    }

    /**
     * [globalToLocal description]
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    globalToLocal(x, y) {
        // get mat, invert mat, append x,y
        var m = this.matrix.clone();
        return new Vector(x - m.a13, y - m.a23); // 600, 600 node 300, 300 -> 10, 10
    }

    /**
     * [addChild description]
     * @param {[type]} child [description]
     */
    addChild(child) {
        this.addChildAt(child, this.children.length);
    }

    /**
     * [addChildAt description]
     * @param {[type]} child [description]
     * @param {[type]} index [description]
     */
    addChildAt(child, index) {
        if(index < 0 || index > this.children.length) {
            throw new Error('index does not exist');
        }
        if(child && child.hasChild && !this.hasChild(child)) {
            if(child.parent) { 
                child.parent.removeChild(child);
            }
            this.children.splice(index, 0, child);
            child.parent = this;    
        }
    }

    /**
     * [removeChild description]
     * @param  {[type]} child [description]
     * @return {[type]}       [description]
     */
    removeChild(child) {
        if(this.hasChild(child)) {
            this.removeChildAt(this.children.indexOf(child));
        } else {
            throw new Error('object is not a child');
        }
    }

    /**
     * [removeChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    removeChildAt(index) {
        if(index < 0 || index >= this.children.length) {
            throw new Error('index does not exist');
        }
        this.children[index].parent = null;
        this.children.splice(index, 1);
    }

    /**
     * [hasChild description]
     * @param  {[type]}  child [description]
     * @return {Boolean}       [description]
     */
    hasChild(child) {
        return this.children.indexOf(child) !== -1;
    }

    /**
     * [getChildren description]
     * @return {[type]} [description]
     */
    getChildren() {
        return this.children;
    }

    /**
     * [getChildByTagName description]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    getChildByTagName(name) {
        // implement
    }

    /**
     * [getChildAt description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    getChildAt(index) {
        if(index < 0 || index >= this.children.length) {
            throw new Error('index does not exist');
        }
        return this.children[index];
    }
}

module.exports = Node;