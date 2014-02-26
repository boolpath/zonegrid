/* NODE MODULES */
var eventerface = require('eventerface'),
    jampBorders = require('./borders'),
    jampCrossings = require('./crossings'),
    jampProtocol = require('./protocol'),
    jampAssets = require('./assets');

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    setup: setup,
    start: {
        assetServer: startAssetServer
    }
};

/*----------------------------------------------------------------------------*/

/**
 *
 */
function setup(zone) { 
    var jamp = {
        handleCrossings: jampCrossings.handle.bind(null, zone),
        createBorder: jampBorders.create.bind(null, zone)
    };

    eventerface.find(zone.namespace, function (zoneNamespace) {
        zoneNamespace.on('/elements/quadrantChange', function(change) {
            // console.log('   quadrantChange', change.quadrant);
            jamp.handleCrossings(change);
        });
        zoneNamespace.on('/zone/neighborChange', function(change) {
            // console.log('zone_' + zone.id + ': neighborChange', change.neighbor);
            jamp.createBorder(change.neighbor, change.value, function (neighbor, side) {
                jampProtocol.implement(zone, neighbor, side);
            });
        });
    });

    return jamp;
}

/**
 *
 */
function startAssetServer(zone, options, onReady) {
    jampAssets.createServer(zone, options, function () {
        if (typeof onReady === 'function') {
            onReady();
        }
    });
}