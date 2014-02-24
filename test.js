var assert = require('assert'),
    zonegrid = require('zonegrid'),
    zone;

describe('zonegrid', function() {
    before(function (done) {
        zone = zonegrid.createZone();
        zone.on('ready', function() {
            done();
        });
    });
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
    // describe('.limits', function() {
    //     it('should fail to set the limits of a zone', function() {
    //         var limit = 100000;
    //         zone.limits.x.lower  = -limit;
    //         zone.limits.x.higher =  limit;
    //         zone.limits.y.lower  = -limit;
    //         zone.limits.y.higher =  limit;
    //         zone.limits.z.lower  = -limit;
    //         zone.limits.z.higher =  limit;

    //         assert.notEqual(zone.limits.x.lower, -limit);
    //         assert.notEqual(zone.limits.x.lower,  limit);
    //         assert.notEqual(zone.limits.y.lower, -limit);
    //         assert.notEqual(zone.limits.y.higher, limit);
    //         assert.notEqual(zone.limits.z.lower, -limit);
    //         assert.notEqual(zone.limits.z.higher, limit);
    //     });
    // });
    describe('.coordinates', function() {
        it('should ]set the coordinates of a zone', function() {
            var higherX = zone.limits.x.higher;
            var higherY = zone.limits.y.higher;
            var higherZ = zone.limits.z.higher;

            zone.coordinates.x = 100;
            zone.coordinates.y = 200;
            zone.coordinates.z = 300;
            assert.equal(zone.coordinates.x, 100);
            assert.equal(zone.coordinates.y, 200);
            assert.equal(zone.coordinates.z, 300);

            assert.equal(zone.limits.x.higher, higherX + 100);  
            assert.equal(zone.limits.y.higher, higherY + 200);  
            assert.equal(zone.limits.z.higher, higherZ + 300);  
        });
    });
    describe('.visibility', function() {
        it('should set the visibility of a zone', function() {
            zone.visibility.x = 100;
            zone.visibility.y = 200;
            zone.visibility.z = 300;
            assert.equal(zone.visibility.x, 100);
            assert.equal(zone.visibility.y, 200);
            assert.equal(zone.visibility.z, 300);

            assert.equal(zone.margins.scope.inner.x.lower - zone.limits.x.lower, zone.visibility.x);
            assert.equal(zone.limits.y.higher - zone.margins.scope.inner.y.higher, zone.visibility.y);
        });
    });
    describe('.handover', function() {
        it('should set the handover value of a zone', function() {
            zone.handover = 10;
            assert.equal(zone.handover, 10);

            assert.equal(zone.margins.handover.bookin.x.lower,   zone.limits.x.lower  + zone.handover);
            assert.equal(zone.margins.handover.checkin.y.higher, zone.limits.y.higher + zone.handover);
            assert.equal(zone.margins.handover.bookin.z.lower,   zone.limits.z.lower  + zone.handover);
        });
    });
    // describe('.margins.scope.inner', function() {
    //     it('should fail to set the inner scope margins of a zone', function() {
    //         var newMargin = 100000;

    //         zone.margins.scope.inner.x.lower  = -newMargin;
    //         zone.margins.scope.inner.x.higher =  newMargin;
    //         zone.margins.scope.inner.y.lower  = -newMargin;
    //         zone.margins.scope.inner.y.higher =  newMargin;
    //         zone.margins.scope.inner.z.lower  = -newMargin;
    //         zone.margins.scope.inner.z.higher =  newMargin;

    //         assert.notEqual(zone.margins.scope.inner.x.lower, -newMargin);
    //         assert.notEqual(zone.margins.scope.inner.x.higher, newMargin);
    //         assert.notEqual(zone.margins.scope.inner.y.lower, -newMargin);
    //         assert.notEqual(zone.margins.scope.inner.y.higher, newMargin);
    //         assert.notEqual(zone.margins.scope.inner.z.lower, -newMargin);
    //         assert.notEqual(zone.margins.scope.inner.z.higher, newMargin);
    //     });
    // });
    // describe('.margins.scope.outer', function() {
    //     it('should fail to set the inner scope margins of a zone', function() {
    //         var newMargin = 100000;

    //         zone.margins.scope.outer.x.lower  = -newMargin;
    //         zone.margins.scope.outer.x.higher =  newMargin;
    //         zone.margins.scope.outer.y.lower  = -newMargin;
    //         zone.margins.scope.outer.y.higher =  newMargin;
    //         zone.margins.scope.outer.z.lower  = -newMargin;
    //         zone.margins.scope.outer.z.higher =  newMargin;

    //         assert.notEqual(zone.margins.scope.outer.x.lower, -newMargin);
    //         assert.notEqual(zone.margins.scope.outer.x.higher, newMargin);
    //         assert.notEqual(zone.margins.scope.outer.y.lower, -newMargin);
    //         assert.notEqual(zone.margins.scope.outer.y.higher, newMargin);
    //         assert.notEqual(zone.margins.scope.outer.z.lower, -newMargin);
    //         assert.notEqual(zone.margins.scope.outer.z.higher, newMargin);
    //     });
    // }); 
    // describe('.margins.handover.bookin', function() {
    //     it('should fail to set the inner scope margins of a zone', function() {
    //         var newMargin = 100000; 

    //         zone.margins.handover.bookin.x.lower  = -newMargin;
    //         zone.margins.handover.bookin.x.higher =  newMargin;
    //         zone.margins.handover.bookin.y.lower  = -newMargin;
    //         zone.margins.handover.bookin.y.higher =  newMargin;
    //         zone.margins.handover.bookin.z.lower  = -newMargin;
    //         zone.margins.handover.bookin.z.higher =  newMargin;

    //         assert.notEqual(zone.margins.handover.bookin.x.lower, -newMargin);
    //         assert.notEqual(zone.margins.handover.bookin.x.higher, newMargin);
    //         assert.notEqual(zone.margins.handover.bookin.y.lower, -newMargin);
    //         assert.notEqual(zone.margins.handover.bookin.y.higher, newMargin);
    //         assert.notEqual(zone.margins.handover.bookin.z.lower, -newMargin);
    //         assert.notEqual(zone.margins.handover.bookin.z.higher, newMargin);
    //     });
    // });
    // describe('.margins.handover.checkin', function() {
    //     it('should fail to set the inner scope margins of a zone', function() {
    //         var newMargin = 100000; 

    //         zone.margins.handover.checkin.x.lower  = -newMargin;
    //         zone.margins.handover.checkin.x.higher =  newMargin;
    //         zone.margins.handover.checkin.y.lower  = -newMargin;
    //         zone.margins.handover.checkin.y.higher =  newMargin;
    //         zone.margins.handover.checkin.z.lower  = -newMargin;
    //         zone.margins.handover.checkin.z.higher =  newMargin;

    //         assert.notEqual(zone.margins.handover.checkin.x.lower, -newMargin);
    //         assert.notEqual(zone.margins.handover.checkin.x.higher, newMargin);
    //         assert.notEqual(zone.margins.handover.checkin.y.lower, -newMargin);
    //         assert.notEqual(zone.margins.handover.checkin.y.higher, newMargin);
    //         assert.notEqual(zone.margins.handover.checkin.z.lower, -newMargin);
    //         assert.notEqual(zone.margins.handover.checkin.z.higher, newMargin);
    //     });
    // });
    describe('.elements#add', function() {
        it('should add elements to a zone', function() {
            var elements = { foo: { name: 'foo' } };
            zone.elements = elements;
            assert.equal(zone.elements.foo, elements.foo);
            zone.elements.add({ name: 'bar' });
            assert.equal(zone.elements.bar.name, 'bar');
        });
    });
    describe('.elements#remove', function() {
        it('should remove elements from a zone', function() {
            var elements = { foo: { name: 'foo' } };
            zone.elements = elements;
            assert.equal(zone.elements.foo, elements.foo);
            zone.elements.remove('foo');
            assert.equal(zone.elements.foo, undefined);
        });
    });
    describe('.elements.position', function() {
        it('should modify the position of an element', function() {
            zone.elements = {
                foo: {
                    position: {
                        x: 100,
                        y: 200,
                        z: 300
                    }
                }
            };

            assert.equal(zone.elements.foo.position.x, 100);
            assert.equal(zone.elements.foo.position.y, 200);
            assert.equal(zone.elements.foo.position.z, 300);

            zone.elements.foo.position.x = -100;
            zone.elements.foo.position.y = -200;
            zone.elements.foo.position.z = -300;

            assert.equal(zone.elements.foo.position.x, -100);
            assert.equal(zone.elements.foo.position.y, -200);
            assert.equal(zone.elements.foo.position.z, -300);
        });
    });
    describe('.abc', function() {
        it('should shift the location of a zone', function() {
        
        });
    });
    describe('.elements.quadrant', function() {
        it('should modify the quadrant of an element', function() {
        
        });
    });
});