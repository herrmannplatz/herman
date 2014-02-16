describe('Node tests', function() {

    it('translate', function() {
        
        var m = new herman.Matrix();
        m.translate(100,100);
        expect(m.a13).toEqual(100);
        expect(m.a23).toEqual(100);
    });
    
});