var assert = require('assert'),
    zonegrid = require('zonegrid'),
    zone = zonegrid.createZone();

describe('zonegrid', function() {
    describe('.id', function() {
        it('should fail to set the ID property of a zone', function() {
            zone.id = 123456789;
            assert.notEqual(zone.id, 123456789);
        });
    });
    describe('.name', function() {
        it('should set the name of a zone', function() {
            zone.name = 'zone';
            assert.equal(zone.name, 'zone');
        });
    });
    describe('.size', function() {
        it('should set the size of a zone', function() {
            zone.size.x = 100;
            zone.size.y = 200;
            zone.size.z = 300;
            assert.equal(zone.size.x, 100);
            assert.equal(zone.size.y, 200);
            assert.equal(zone.size.z, 300);
        });
    });
    describe('.visibility', function() {
        it('should set the visibility of a zone', function() {
            zone.visibility.horizontal = 100;
            zone.visibility.vertical = 200;
            assert.equal(zone.visibility.horizontal, 100);
            assert.equal(zone.visibility.vertical, 200);
        });
    });
    describe('.handover', function() {
        it('should set the handover value of a zone', function() {
            zone.handover = 10;
            assert.equal(zone.handover, 10);
        });
    });
    describe('.margins.scope.inner', function(){
        it('should fail to set the inner scope margins of a zone', function() {
            var newMargin = 100000;

            zone.margins.scope.inner.x.lower  = -newMargin;
            zone.margins.scope.inner.x.higher =  newMargin;
            zone.margins.scope.inner.y.lower  = -newMargin;
            zone.margins.scope.inner.y.higher =  newMargin;
            zone.margins.scope.inner.z.lower  = -newMargin;
            zone.margins.scope.inner.z.higher =  newMargin;

            assert.notEqual(zone.margins.scope.inner.x.lower, -newMargin);
            assert.notEqual(zone.margins.scope.inner.x.higher, newMargin);
            assert.notEqual(zone.margins.scope.inner.y.lower, -newMargin);
            assert.notEqual(zone.margins.scope.inner.y.higher, newMargin);
            assert.notEqual(zone.margins.scope.inner.z.lower, -newMargin);
            assert.notEqual(zone.margins.scope.inner.z.higher, newMargin);
        });
    });
    describe('.margins.scope.outer', function(){
        it('should fail to set the inner scope margins of a zone', function() {
            var newMargin = 100000;

            zone.margins.scope.outer.x.lower  = -newMargin;
            zone.margins.scope.outer.x.higher =  newMargin;
            zone.margins.scope.outer.y.lower  = -newMargin;
            zone.margins.scope.outer.y.higher =  newMargin;
            zone.margins.scope.outer.z.lower  = -newMargin;
            zone.margins.scope.outer.z.higher =  newMargin;

            assert.notEqual(zone.margins.scope.outer.x.lower, -newMargin);
            assert.notEqual(zone.margins.scope.outer.x.higher, newMargin);
            assert.notEqual(zone.margins.scope.outer.y.lower, -newMargin);
            assert.notEqual(zone.margins.scope.outer.y.higher, newMargin);
            assert.notEqual(zone.margins.scope.outer.z.lower, -newMargin);
            assert.notEqual(zone.margins.scope.outer.z.higher, newMargin);
        });
    }); 
    describe('.margins.handover.bookin', function(){
        it('should fail to set the inner scope margins of a zone', function() {
            var newMargin = 100000; 

            zone.margins.handover.bookin.x.lower  = -newMargin;
            zone.margins.handover.bookin.x.higher =  newMargin;
            zone.margins.handover.bookin.y.lower  = -newMargin;
            zone.margins.handover.bookin.y.higher =  newMargin;
            zone.margins.handover.bookin.z.lower  = -newMargin;
            zone.margins.handover.bookin.z.higher =  newMargin;

            assert.notEqual(zone.margins.handover.bookin.x.lower, -newMargin);
            assert.notEqual(zone.margins.handover.bookin.x.higher, newMargin);
            assert.notEqual(zone.margins.handover.bookin.y.lower, -newMargin);
            assert.notEqual(zone.margins.handover.bookin.y.higher, newMargin);
            assert.notEqual(zone.margins.handover.bookin.z.lower, -newMargin);
            assert.notEqual(zone.margins.handover.bookin.z.higher, newMargin);
        });
    });
    describe('.margins.handover.checkin', function(){
        it('should fail to set the inner scope margins of a zone', function() {
            var newMargin = 100000; 

            zone.margins.handover.checkin.x.lower  = -newMargin;
            zone.margins.handover.checkin.x.higher =  newMargin;
            zone.margins.handover.checkin.y.lower  = -newMargin;
            zone.margins.handover.checkin.y.higher =  newMargin;
            zone.margins.handover.checkin.z.lower  = -newMargin;
            zone.margins.handover.checkin.z.higher =  newMargin;

            assert.notEqual(zone.margins.handover.checkin.x.lower, -newMargin);
            assert.notEqual(zone.margins.handover.checkin.x.higher, newMargin);
            assert.notEqual(zone.margins.handover.checkin.y.lower, -newMargin);
            assert.notEqual(zone.margins.handover.checkin.y.higher, newMargin);
            assert.notEqual(zone.margins.handover.checkin.z.lower, -newMargin);
            assert.notEqual(zone.margins.handover.checkin.z.higher, newMargin);
        });
    });
    describe('.margins.elements#add', function(){
        it('should add elements to a zone', function() {
            var elements = { foo: { name: 'foo' } };
            zone.elements = elements;
            assert.equal(zone.elements.foo, elements.foo);
            zone.elements.add({ name: 'bar' });
            assert.equal(zone.elements.bar.name, 'bar');
        });
    });
    describe('.margins.elements#remove', function(){
        it('should add elements to a zone', function() {
            var elements = { foo: { name: 'foo' } };
            zone.elements = elements;
            assert.equal(zone.elements.foo, elements.foo);
            zone.elements.remove('foo');
            assert.equal(zone.elements.foo, undefined);
        });
    });
});