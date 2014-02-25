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
    setup: setup
}; 

/*----------------------------------------------------------------------------*/

/** Creates the servers required by a zone to operate
 * @param {object} zone - The zone requesting the servers to be created
 * @param {object} globalNamespace - The name of the global namespace where the other zone components will emit events
 * @returns {object} servers - A set of the zone's servers
 */
function setup(zone, globalNamespace) {
    var servers = {
        start: start,
        create: {
            jampServer: jamp.createServer.bind(null, zone, globalNamespace)
        }
    };

    /** Starts the servers of a given zone
     * @param {function} onStarted - Starts the servers of a zone
     */
    function start(onStarted) {
        if (typeof onStarted == 'function') {
            onStarted();
        }
    }

    return servers;
}