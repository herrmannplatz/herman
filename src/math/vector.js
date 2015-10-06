
class Vector {

    /**
     * Vector
     * @class Vector
     * @constructor
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * [add description]
     * @param {[type]} vec [description]
     */
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    /**
     * [substract description]
     * @param  {[type]} vec [description]
     * @return {[type]}     [description]
     */
    substract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    };

    /**
     * [normalize description]
     * @return {[type]} [description]
     */
    normalize() {
        var length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    };

    /**
     * [dot description]
     * @param  {[type]} vec [description]
     * @return {[type]}     [description]
     */
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    
    /**
     * [length description]
     * @return {[type]} [description]
     */
    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

}

module.exports = Vector