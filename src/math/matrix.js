
window.herman = window.herman || {};

(function(herman) {

	// TODO chaining?

	var DEG_TO_RAD = Math.PI/180;

	var ACCURACY = 15;

	/**
	 * 3x3 Matrix
	 * @constructor
	 *
	 * | a11 a12 a13 |
	 * | a21 a22 a23 |
	 * | a31 a32 a33 |
	 * 
	 */
	herman.Matrix = function() {
		//TODO param
		this.a11 = 1;
		this.a12 = 0;
		this.a13 = 0;
		this.a21 = 0;
		this.a22 = 1;
		this.a23 = 0;
		this.a31 = 0; // remove?
		this.a32 = 0; // remove?
		this.a33 = 1; // remove?
	}

	herman.Matrix.prototype = {
		
		/**
		 * [translate description]
		 * @param  {[type]} tx
		 * @param  {[type]} ty
		 * @return {[type]}
		 */
		translate : function(tx, ty) {
			this.a13 += tx;
			this.a23 += ty;
			return this;
		},

		/**
		 * [rotate description]
		 * @param  {Number} angle
		 * @return {[type]}
		 */
		rotate : function(angle) {
			angle = angle*DEG_TO_RAD; // or use radians?
			var sin = Math.sin(angle).toFixed(ACCURACY);
			var cos = Math.cos(angle).toFixed(ACCURACY);

			var a11 = this.a11;
			// var a12 = this.a12; // remove?
			// var a13 = this.a13;
			var a21 = this.a21;
			// var a22 = this.a22; // remove?
			// var a23 = this.a23;
			// var a31 = this.a31;
			// var a32 = this.a32;
			// var a33 = this.a33;

			this.a11 = (cos*a11) + (sin*this.a12); //+ (0*a13);
			this.a12 = (-sin*a11) + (cos*this.a12); // + (0*a13);
			// this.a13 = (0*a11) + (0*a12) + (1*a13); 
			this.a21 = (cos*a21) + (sin*this.a22);//  + (0*a23);
			this.a22 = (-sin*a21) + (cos*this.a22);//  + (0*a23);
			// this.a23 = (0*a21) + (0*a22) + (1*a23); 
			// this.a31 = (cos*a31) + (sin*a32) + (0*a33);
			// this.a32 = (-sin*a31) + (cos*a32) + (0*a33);
			// this.a33 = (0*a31) + (0*a32) + (1*a33); 
			return this;
		},

		/**
		 * [scale description]
		 * @param  {[type]} scale
		 * @return {[type]}
		 */
		scale : function(scale) {
			// var a11 = this.a11;
			// var a12 = this.a12; 
			// var a13 = this.a13;
			// var a21 = this.a21;
			// var a22 = this.a22;
			// var a23 = this.a23;
			// var a31 = this.a31;
			// var a32 = this.a32;
			// var a33 = this.a33;

			this.a11 *= scale; // this.a11 = (scale*a11) + (0*a12)+ (0*a13);
			this.a12 *= scale; // this.a12 = (0*a11) + (scale*a12) + (0*a13); 
			// this.a13 = (0*a11) + (0*a12) + (1*a13);
			this.a21 *= scale; // this.a21 = (scale*a21) + (0*a22) + (0*a23);
			this.a22 *= scale; // this.a22 = (0*a21) + (scale*a22) + (0*a23);
			// this.a23 = (0*a21) + (0*a22) + (1*a23);
			// this.a31 = (scale*a31) + (0*a32) + (0*a33);
			// this.a32 = (0*a31) + (scale*a32) + (0*a33);
			// this.a33 = (0*a31) + (0*a32) + (1*a33);
			return this;
		},

		/**
		 * [scaleNonUniform description]
		 * @param  {[type]} scaleX [description]
		 * @param  {[type]} scaleY [description]
		 * @return {[type]}        [description]
		 */
		scaleNonUniform : function(scaleX, scaleY) {
			// TODO
			return this;
		},

		/**
		 * [transform description]
		 * @param  {[type]} tx    [description]
		 * @param  {[type]} ty    [description]
		 * @param  {[type]} angle [description]
		 * @param  {[type]} scale [description]
		 * @return {[type]}       [description]
		 */
		transform : function(tx, ty, angle, scale) {
			return this.translate(tx, ty).rotate(angle).scale(scale);
		},

		/**
		 * [multiply description]
		 * @param  {[type]} m
		 * @return {[type]}
		 *
		 *					| m.a11 m.a12 m.a13 |
		 *     				| m.a21 m.a22 m.a23 |
		 *         			| m.a31 m.a32 m.a33 |
		 * | a11 a12 a13 |
		 * | a21 a22 a23 |
		 * | a31 a32 a33 |
		 * 
		 */
		multiply : function(m) {
			var a11 = this.a11;
			var a12 = this.a12; 
			var a13 = this.a13;
			var a21 = this.a21;
			var a22 = this.a22;
			var a23 = this.a23;
			var a31 = this.a31; // 0
			var a32 = this.a32; // 0
			var a33 = this.a33; // 1

			this.a11 = (a11*m.a11) + (a12*m.a21) + (a13*m.a31);
			this.a12 = (a11*m.a12) + (a12*m.a22) + (a13*m.a32); 
			this.a13 = (a11*m.a13) + (a12*m.a23) + (a13*m.a33); 

			this.a21 = (a21*m.a11) + (a22*m.a21) + (a23*m.a31);
			this.a22 = (a21*m.a12) + (a22*m.a22) + (a23*m.a32);
			this.a23 = (a21*m.a13) + (a22*m.a23) + (a23*m.a33);

			this.a31 = (a31*m.a11) + (a32*m.a21) + (a33*m.a31);
			this.a32 = (a31*m.a12) + (a32*m.a22) + (a33*m.a32);
			this.a33 = (a31*m.a13) + (a32*m.a23) + (a33*m.a33);
			return this;
		},

		/**
		 * [toString description]
		 * @return {[type]}
		 */
		log : function() {
			return 	this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' +  
					this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + 
					this.a31 + ' ' + this.a32 + ' ' + this.a33 + '\n';
		}

	};

})(window.herman);