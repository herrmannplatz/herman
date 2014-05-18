
herman.namespace('math.Matrix', function() {
    "use strict";

    //TODO: scaleX, scaleY or scaleNonUniform

    var PRECISION = 15;

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
        this.a13 += tx; //Math.round(tx); // tx | 0;
        this.a23 += ty; //Math.round(ty); // ty | 0;
        return this;
    };

    /**
     * [rotate description]j
     * @param  {Number} angle radians
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
        return this.translate(tx, ty).rotate(angle).scale(scale); // TxRxS
    };

    /**
     * [multiply description]
     * @param  {Matrix} m
     * @return {Matrix}
     *
     * @example
     * 
     *                  | m.a11 m.a12 m.a13 |
     *                  | m.a21 m.a22 m.a23 |
     *                  | m.a31 m.a32 m.a33 |
     * | a11 a12 a13 |
     * | a21 a22 a23 |
     * | a31 a32 a33 |
     * 
     */
    Matrix.prototype.multiply = function(m) {
        var a11 = this.a11;
        var a12 = this.a12; 
        var a21 = this.a21;
        var a22 = this.a22;

        this.a11 = (a11*m.a11) + (a12*m.a21);
        this.a12 = (a11*m.a12) + (a12*m.a22); 
        this.a13 = (a11*m.a13) + (a12*m.a23) + this.a13; 

        this.a21 = (a21*m.a11) + (a22*m.a21);
        this.a22 = (a21*m.a12) + (a22*m.a22);
        this.a23 = (a21*m.a13) + (a22*m.a23) + this.a23;
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
     * checks wether matrix is an identity matrix
     * @return {Boolean} 
     */
    Matrix.prototype.isIdentity = function() {
        return  this.a11 === 1 && this.a12 === 0 && this.a13 === 0 &&
                this.a21 === 0 && this.a22 === 1 && this.a23 === 0;
    };

    /**
     * returns matrix as a nicely formatted string
     * @return {String}
     */
    Matrix.prototype.print = function() {
        return  'matrix' + '\n' +
                this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' +  
                this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + 
                '0'      + ' ' + '0'      + ' ' + '1'      + '\n';
    };

    return Matrix;

});