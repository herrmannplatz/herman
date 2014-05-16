describe('herman Node', function() {

    describe('addChild', function() {

        it('without children', function() {
            var n = new herman.Node();
            expect(n.getChildren().length).toEqual(0);
        });

        it('with excact one child', function() {
            var p = new herman.Node();
            var c = new herman.Node();
            p.addChild(c);
            expect(p.hasChild(c)).toEqual(true);
            expect(p.getChildren().length).toEqual(1);
            expect(c.parent).toEqual(p);
        });

        it('with null added as child', function() {
            var p = new herman.Node();
            p.addChild(null);
            expect(p.getChildren().length).toEqual(0);
        });

        it('with an empty object added as child', function() {
            var p = new herman.Node();
            p.addChild({});
            expect(p.getChildren().length).toEqual(0);
        });

    });

    it('addChild', function() {
        // add object to two different nodes
        var n6 = new herman.Node();
        var n7 = new herman.Node();
        var c1 = new herman.Node();
        n6.addChild(c1);
        n7.addChild(c1);
        expect(n6.hasChild(c1)).toEqual(false);
        expect(n7.hasChild(c1)).toEqual(true);
        expect(n6.getChildren().length).toEqual(0);
        expect(n7.getChildren().length).toEqual(1);
        expect(c1.parent).toEqual(n7);

    });

    it('addChildAt', function() {
        var n = new herman.Node();
        n.addChild(new herman.Node());
        n.addChild(new herman.Node());
        n.addChild(new herman.Node());
        var c = new herman.Node();
        n.addChildAt(c,0);
        expect(n.getChildAt(0)).toEqual(c);
    });

    it('removeChild', function() {

        // remove child
        var n = new herman.Node();
        var c = new herman.Node();
        n.addChild(c);
        expect(n.hasChild(c)).toEqual(true);
        expect(n.getChildren().length).toEqual(1);
        n.removeChild(c);
        expect(n.hasChild(c)).toEqual(false);
        expect(n.getChildren().length).toEqual(0);
        expect(c.parent).toEqual(null);

        // wrong child
        var n1 = new herman.Node();
        var n2 = new herman.Node();
        var c = new herman.Node();
        n2.addChild(c);
        n1.removeChild(c);
        expect(n1.hasChild(c)).toEqual(false);
        expect(n2.hasChild(c)).toEqual(true);
        expect(n1.getChildren().length).toEqual(0);
        expect(n2.getChildren().length).toEqual(1);
        expect(c.parent).toEqual(n2);

    });

    it('localToGlobal', function() {
        var n1 = new herman.Node();
        var n2 = new herman.Node();
        var c = new herman.Node();

        n1.addChild(n2);
        n2.addChild(c);

        n2.x = 100;
        n2.y = 100;

        c.x = -50;
        c.y = -50;

        var p = c.localToGlobal(0,0);
        expect(p.x).toEqual(50);
        expect(p.y).toEqual(50);

    });

    it('localToGlobal', function() {
        var n1 = new herman.Node();
        var n2 = new herman.Node();
        var c = new herman.Node();

        n1.addChild(n2);
        n2.addChild(c);

        n2.x = 100;
        n2.y = 100;

        c.x = -50;
        c.y = -50;

        var p = c.globalToLocal(200,200);
        expect(p.x).toEqual(150);
        expect(p.y).toEqual(150);

    });

    
});