var assert = require('assert'),
    zonegrid = require('zonegrid'),
    zone = zonegrid.createZone();

describe('zonegrid', function(){
    describe('.size', function(){
        it('should set the size of a zone', function(){
            zone.size.x = 100;
            zone.size.y = 200;
            zone.size.z = 300;
            assert.equal(zone.size.x, 100);
            assert.equal(zone.size.y, 200);
            assert.equal(zone.size.z, 300);
        });
    });
    describe('.visibility', function(){
        it('should set the visibility of a zone', function(){
            zone.visibility.horizontal = 100;
            zone.visibility.vertical = 200;
            assert.equal(zone.visibility.horizontal, 100);
            assert.equal(zone.visibility.vertical, 200);
        });
    });
    describe('.handover', function(){
        it('should set the handover value of a zone', function(){
            zone.handover = 10;
            assert.equal(zone.handover, 10);
        });
    });
    describe('.margins', function(){
        it('should set the visibility of a zone', function(){
            zone.handover = 10;
            assert.equal(zone.handover, 10);
        });
    });
});