describe('herman Matrix', function() {

    it('translate', function() {
        
        var m = new herman.math.Matrix();
        m.translate(100,100);
        expect(m.a13).toEqual(100);
        expect(m.a23).toEqual(100);
    });

    describe('determinant', function() {

        it('of an identity matrix', function() {        
            var m = new herman.math.Matrix();
            expect(m.determinant()).toEqual(1);
        });    
    });
    
});