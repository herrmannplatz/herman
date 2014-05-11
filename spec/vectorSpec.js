describe('math.Vector tests', function() {

    it('initialization', function() {

        var v = new herman.math.Vector(4,4);
        expect(v.x).toEqual(4);
        expect(v.y).toEqual(4);

    });   

    it('add', function() {

        var v1 = new herman.math.Vector(4,4);
        var v2 = new herman.math.Vector(5,5);
        v1.add(v2);
        expect(v1.x).toEqual(9);
        expect(v1.y).toEqual(9);

    });   

    it('substract', function() {

        var v1 = new herman.math.Vector(4,4);
        var v2 = new herman.math.Vector(1,1);
        v1.substract(v2);
        expect(v1.x).toEqual(3);
        expect(v1.y).toEqual(3);

    }); 

    it('length', function() {

        var l = Math.sqrt(32); 
        var v = new herman.math.Vector(4,4);
        expect(v.length()).toEqual(l);

    });  

    it('normalize', function() {
        
        var l = 4 / Math.sqrt(32) ; 
        var v = new herman.math.Vector(4,4);
        v.normalize();
        expect(v.x).toEqual(l);
        expect(v.y).toEqual(l);

    }); 

    it('dot product', function() {

        var v1 = new herman.math.Vector(0,1);
        var v2 = new herman.math.Vector(1,0);
        var angle = v1.dot(v2);
        expect(angle).toEqual(0); // orthogonal

    });  

    
});