describe('Node tests', function() {

    it('addChild', function() {
        // no child
        var n1 = new herman.Node();
        expect(n1.getChildren().length).toEqual(0);

        // add one child
        var n2 = new herman.Node();
        var c = new herman.Node();
        n2.addChild(c);
        expect(n2.hasChild(c)).toEqual(true);
        expect(n2.getChildren().length).toEqual(1);
        expect(c.parent).toEqual(n2);

        // add null
        var n4 = new herman.Node();
        n4.addChild(null);
        expect(n4.getChildren().length).toEqual(0);

        // add object
        var n5 = new herman.Node();
        n5.addChild({});
        expect(n5.getChildren().length).toEqual(0);

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
    
});