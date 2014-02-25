/* NODE MODULES */
var eventerface = require('eventerface'),
    jampBorders = require('./borders'),
    jampCrossings = require('./crossings');

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    createServer: createServer
};

/*----------------------------------------------------------------------------*/

function createServer(zone, globalNamespace) { 
    var jamp = {
        handleCrossings: jampCrossings.handle.bind(null, zone),
        createBorder: jampBorders.create.bind(null, zone, globalNamespace)
    };

    eventerface.find(globalNamespace, function (zoneNamespace) {
        zoneNamespace.on('/elements/quadrantChange', function(change) {
            // console.log('   quadrantChange', change.quadrant);
            jamp.handleCrossings(change);
        });
        zoneNamespace.on('/zone/neighborChange', function(change) {
            // console.log('zone_' + zone.id + ': neighborChange', change.neighbor);
            jamp.createBorder(change.neighbor, change.value);
        });
    });

    return jamp;
}