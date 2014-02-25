/* NODE MODULES */
var eventerface = require('eventerface'),
    jamp = require('./jamp');

/** LOCAL OBJECT 
 * @property {} - 
 */
var SERVERS = {
    
};

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    create: {
        jampServer: createJampServer
    }
}; 

/*----------------------------------------------------------------------------*/

/** Creates the servers required by a zone to operate
 * @param {object} zone - The zone requesting the servers to be created
 * @param {object} globalNamespace - The name of the global namespace where the other zone components will emit events
 * @returns {object} servers - A set of the zone's servers
 */
function createJampServer(zone, globalNamespace) {
    var servers;

    eventerface.find(globalNamespace, function (zoneNamespace) {
        zoneNamespace.on('/elements/quadrantChange', function(change) {
            // console.log('   quadrantChange', change.quadrant);
            jamp.handleQuadrantChange(zone, change);
        });
        zoneNamespace.on('/zone/neighborChange', function(change) {
            // console.log('zone_' + zone.id + ': neighborChange', change.neighbor);
            jamp.createChannel(zone, zoneNamespace, change.neighbor, change.value);
        });
    });

    return servers;
}


