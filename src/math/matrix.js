
herman.namespace('math.Matrix', function() {
    "use strict";

// private 

    /**
     * [PRECISION description]
     * @type {Number}
     */
    var PRECISION = 15;

    /**
     * [multiply description]
     *
     *                          | m2.a11 m2.a12 m2.a13 |
     *                          | m2.a21 m2.a22 m2.a23 |
     *                          | m2.a31 m2.a32 m2.a33 |
     * | m1.a11 m1.a12 m1.a13 |
     * | m1.a21 m1.a22 m1.a23 |
     * | m1.a31 m1.a32 m1.a33 |
     * 
     * @param  {[type]} m1 [description]
     * @param  {[type]} m2 [description]
     * @return {[type]}    [description]
     */
    var multiply = function(m1, m2) {
        var a11 = m1.a11;
        var a12 = m1.a12; 
        var a21 = m1.a21;
        var a22 = m1.a22;

        m1.a11 = (a11*m2.a11) + (a12*m2.a21);
        m1.a12 = (a11*m2.a12) + (a12*m2.a22); 
        m1.a13 = (a11*m2.a13) + (a12*m2.a23) + m1.a13; 

        m1.a21 = (a21*m2.a11) + (a22*m2.a21);
        m1.a22 = (a21*m2.a12) + (a22*m2.a22);
        m1.a23 = (a21*m2.a13) + (a22*m2.a23) + m1.a23;
    }; 

// public

    /**
     * 3x3 Matrix
     * @class Matrix
     * @constructor
     */
    function Matrix() {
        //TODO param? (a,b,c,d,e,f) or (matrix), rename members
        this.identity();
    }
    
    /**
     * [translate description]
     * @param  {Number} tx
     * @param  {Number} ty
     * @return {Matrix}
     */
    Matrix.prototype.translate = function(tx, ty) {
        this.a13 += tx;
        this.a23 += ty; 
        return this;
    };

    /**
     * [rotate description]j
     * @param  {Number} angle radians
     * @method rotate
     * @return {Matrix}
     */
    Matrix.prototype.rotate = function(angle) {
        angle = (angle*herman.math.Utils.DEG_TO_RAD).toFixed(PRECISION); // or use radians?
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var a11 = this.a11;
        var a21 = this.a21;

        this.a11 = (cos*a11) + (sin*this.a12); 
        this.a12 = (-sin*a11) + (cos*this.a12); 
        this.a21 = (cos*a21) + (sin*this.a22);
        this.a22 = (-sin*a21) + (cos*this.a22); 
        return this;
    };

    /**
     * [scale description]
     * @param  {Number} scale
     * @return {Matrix}
     */
    Matrix.prototype.scale = function(scale) {
        this.a11 *= scale; 
        this.a12 *= scale;  
        this.a21 *= scale; 
        this.a22 *= scale; 
        return this;
    };

    /**
     * [transform description]
     */
    Matrix.prototype.transform = function(tx, ty, angle, scale) {
        return this.translate(tx, ty).rotate(angle).scale(scale);
    };

    /**
     * [multiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     */
    Matrix.prototype.multiply = function(m) {
        multiply(this,m);
        return this;
    };

    /**
     * [preMultiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     */
    Matrix.prototype.preMultiply = function(m) {
        multiply(m,this);
        return this;    
    };

    /**
     * [invert description]
     *
     * | |a22 a23| |a13 a12| |a12 a13| |
     * | |a32 a33| |a33 a32| |a22 a23| |
     * |                               |    
     * | |a23 a21| |a11 a13| |a13 a11| |
     * | |a33 a31| |a31 a33| |a23 a21| |
     * |                               |
     * | |a21 a22| |a12 a11| |a11 a12| |
     * | |a31 a32| |a32 a31| |a21 a22| |
     *
     * @return {[type]} [description]
     */
    Matrix.prototype.inverse = function() {
        //TODO: check determinant
        var invdet = 1/this.determinant();
        var m = new Matrix();
        m.a11 = this.a22 * invdet;
        m.a12 = -this.a12 * invdet;
        m.a13 = (this.a12 * this.a23 - this.a22 * this.a13) * invdet;
        m.a21 = -this.a21 * invdet;
        m.a22 = this.a11 * invdet;
        m.a23 = (this.a13 * this.a21 - this.a23 * this.a11) * invdet;
        m.a31 = 0;
        m.a32 = 0;
        m.a33 = (this.a11 * this.a22 - this.a21 * this.a12) * invdet;
        return m;
    };

    /**
     * [determinant description]
     *
     * | a11 a12 a13 | a11 a12
     * | a21 a22 a23 | a21 a22
     * | a31 a32 a33 | a31 a32
     *
     * @return {Number}
     */
    Matrix.prototype.determinant = function() {
        return this.a11 * this.a22 - this.a21 * this.a12;
    };

    /**
     * [identity description]
     * @return {Matrix} 
     */
    Matrix.prototype.identity = function() {
        this.a11 = this.a22 = this.a33 = 1; 
        this.a12 = this.a13 = this.a21 = this.a23 = this.a31 = this.a32 = 0;
        return this;
    };

    /**
     * checks whether matrix is an identity matrix
     * @return {Boolean} 
     */
    Matrix.prototype.isIdentity = function() {
        return  this.a11 === 1 && this.a12 === 0 && this.a13 === 0 &&
                this.a21 === 0 && this.a22 === 1 && this.a23 === 0;
    };

    /**
     * [decompose description]
     * @return {[type]} [description]
     */
    Matrix.prototype.decompose = function() {
        var decomposed = {};
        decomposed.rotation = herman.math.Utils.RAD_TO_DEG * Math.atan2(this.a21,this.a11);
        return decomposed;
    };

    /**
     * clones matrix
     * @return {herman.math.Matrix}
     */
    Matrix.prototype.clone = function() {
        var m = new Matrix();
        m.a11 = this.a11;
        m.a12 = this.a12;
        m.a13 = this.a13;
        m.a21 = this.a21;
        m.a22 = this.a22;
        m.a23 = this.a23;
        return m;
    };

    /**
     * returns matrix as a nicely formatted string
     * @return {String}
     */
    Matrix.prototype.print = function() {
        return  'matrix' + '\n' +
                this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' +  
                this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + 
                this.a31 + ' ' + this.a32 + ' ' + this.a33 + '\n';
    };

    return Matrix;

});