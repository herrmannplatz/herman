describe('herman Matrix', function() {

    describe('translate', function() {

        it('translated', function() {        
            var m = new herman.math.Matrix();
            m.translate(100,100);
            expect(m.a13).toEqual(100);
            expect(m.a23).toEqual(100);
        });   

    });

    describe('inverse', function() {

        it('of an translated matrix', function() {        
            var m = new herman.math.Matrix();
            m.translate(10,10);
            var inverse = m.inverse();
            m.multiply(inverse);
            expect(m.isIdentity()).toEqual(true);
        });  

        it('of an translated and rotated matrix', function() {        
            var m = new herman.math.Matrix();
            m.translate(100,100);
            m.rotate(23);
            var inverse = m.inverse();
            m.multiply(inverse);
            expect(m.isIdentity()).toEqual(true);
        });

    });

    describe('determinant', function() {

        it('of an identity matrix', function() {        
            var m = new herman.math.Matrix();
            expect(m.determinant()).toEqual(1);
        });  

    });

    describe('isIdentity', function() {

        it('of an identity matrix', function() {        
            var m = new herman.math.Matrix();
            expect(m.isIdentity()).toEqual(true);
        }); 

        it('of an non identity matrix', function() {        
            var m = new herman.math.Matrix();
            m.translate(10,10);
            expect(m.isIdentity()).toEqual(false);
        });  

    });
    
});