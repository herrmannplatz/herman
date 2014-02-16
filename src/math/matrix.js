
herman.createModule('Matrix',function(){

	// TODO scaleX, scaleY or scaleNonUniform

	var DEG_TO_RAD = Math.PI/180;

	var PRECISION = 5;

	/**
	 * 3x3 Matrix
	 * @constructor
	 *
	 * | a11 a12 a13 |
	 * | a21 a22 a23 |
	 * | a31 a32 a33 |
	 * 
	 */
	function Matrix() {
		//TODO param? (a,b,c,d,e,f) or (matrix), rename members
		this.a11 = 1; 
		this.a12 = 0;
		this.a13 = 0;
		this.a21 = 0;
		this.a22 = 1;
		this.a23 = 0;
	}

	Matrix.prototype = {
		
		/**
		 * [translate description]
		 * @param  {[type]} tx
		 * @param  {[type]} ty
		 * @return {[type]}
		 */
		translate : function(tx, ty) {
			this.a13 += tx; //Math.round(tx); // tx | 0;
			this.a23 += ty; //Math.round(ty); // ty | 0;
			return this;
		},

		/**
		 * [rotate description]
		 * @param  {Number} angle radians
		 * @return {[type]}
		 */
		rotate : function(angle) {
			angle = (angle*DEG_TO_RAD).toFixed(PRECISION); // or use radians?
			var sin = Math.sin(angle);
			var cos = Math.cos(angle);
			var a11 = this.a11;
			var a21 = this.a21;

			this.a11 = (cos*a11) + (sin*this.a12); 
			this.a12 = (-sin*a11) + (cos*this.a12); 
			this.a21 = (cos*a21) + (sin*this.a22);
			this.a22 = (-sin*a21) + (cos*this.a22); 
			return this;
		},

		/**
		 * [scale description]
		 * @param  {[type]} scale
		 * @return {[type]}
		 */
		scale : function(scale) {
			this.a11 *= scale; 
			this.a12 *= scale;  
			this.a21 *= scale; 
			this.a22 *= scale; 
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
			return this.translate(tx, ty).rotate(angle).scale(scale); // TxRxS
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
			var a21 = this.a21;
			var a22 = this.a22;

			this.a11 = (a11*m.a11) + (a12*m.a21);
			this.a12 = (a11*m.a12) + (a12*m.a22); 
			this.a13 = (a11*m.a13) + (a12*m.a23) + this.a13; 

			this.a21 = (a21*m.a11) + (a22*m.a21);
			this.a22 = (a21*m.a12) + (a22*m.a22);
			this.a23 = (a21*m.a13) + (a22*m.a23) + this.a23;
			return this;
		},

		/**
		 * [identity description]
		 * @return {[type]} [description]
		 */
		identity : function() {
			this.a11 = 1; 
			this.a12 = 0;
			this.a13 = 0;
			this.a21 = 0;
			this.a22 = 1;
			this.a23 = 0;
			return this;
		},

		/**
		 * [toString description]
		 * @return {[type]}
		 */
		print : function() {
			return 	'matrix' + '\n' +
					this.a11 + ' ' + this.a12 + ' ' + this.a13 + '\n' +  
					this.a21 + ' ' + this.a22 + ' ' + this.a23 + '\n' + 
					'[0]'	 + ' ' + '[0]'	  + ' ' + '[1]'	   + '\n';
		}

	};

	return Matrix;

});