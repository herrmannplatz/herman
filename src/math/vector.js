
herman.namespace('math.Vector', function() {
    "use strict";

    /**
     * Vector
     * @class Vector
     * @constructor
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * [add description]
     * @param {[type]} vec [description]
     */
    Vector.prototype.add  = function(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    };

    /**
     * [substract description]
     * @param  {[type]} vec [description]
     * @return {[type]}     [description]
     */
    Vector.prototype.substract = function(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    };

    /**
     * [normalize description]
     * @return {[type]} [description]
     */
    Vector.prototype.normalize = function() {
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
    Vector.prototype.dot = function(vec) {
        return this.x * vec.x + this.y * vec.y;
    };
    
    /**
     * [length description]
     * @return {[type]} [description]
     */
    Vector.prototype.length = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };

    return Vector;

});