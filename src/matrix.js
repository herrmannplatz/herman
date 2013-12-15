
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
		},

		/**
		 * [multiply description]
		 * @param  {[type]} m
		 * @return {[type]}
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

			this.a11 = (m.a11*a11) + (m.a21*a12) + (m.a31*a13); // m11 21 31
			this.a12 = (m.a12*a12) + (m.a22*a12) + (m.a32*a13); // m12 22 32
			this.a13 = (m.a13*a13) + (m.a23*a12) + (m.a33*a13); // m13 23 33
			this.a21 = (m.a11*a21) + (m.a21*a22) + (m.a31*a23); // m11 21 31
			this.a22 = (m.a12*a22) + (m.a22*a22) + (m.a32*a23); // m12 22 32
			this.a23 = (m.a13*a23) + (m.a23*a22) + (m.a33*a23); // m13 23 33
			this.a31 = (m.a11*a31) + (m.a21*a32) + (m.a31*a33); // m11 21 31
			this.a32 = (m.a12*a32) + (m.a22*a32) + (m.a32*a33); // m12 22 32
			this.a33 = (m.a13*a33) + (m.a23*a32) + (m.a33*a33); // m13 23 33
		},

		/**
		 * [toString description]
		 * @return {[type]}
		 */
		toString : function() {
			return 	this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' +  
					this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + 
					this.a31 + ' ' + this.a32 + ' ' + this.a33 + '\n';
		}

	};

})(window.herman);