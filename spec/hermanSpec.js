describe('herman core', function() {

    it('createModule', function() {

        herman.namespace('canvas.Node', function() { return function Node() {} });
        expect(herman.canvas.Node).not.toBe(null);
        
        herman.namespace('bla.foo.Func', function() { return { blub : 12 } });
        expect(herman.bla.foo.Func.blub).toEqual(12);

    });
    
});