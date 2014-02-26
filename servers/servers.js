/* NODE MODULES */
var eventerface = require('eventerface'),
    jamp = require('./jamp'),
    webs = require('./webSockets');

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
 * @returns {object} servers - A set of the zone's servers
 */
function setup(zone) {
    var servers = {
        start: start.bind(null, zone, zone.amespace),
        setup: {
            jampServer: jamp.setup.bind(null, zone, zone.namespace)
        }
    };

    return servers;
}

/** Starts the servers of a given zone
 * @param {function} onStarted - Starts the servers of a zone
 */
function start(zone, globalNamespace, onStarted) {
    var startedServers = 0,
        totalServers = 3, 
        jampAssets = zone.servers.jampAssets,
        webServer = zone.servers.webServer,
        webSockets = zone.servers.webSockets;
        
    var serverReady = function () {
        if (++startedServers === totalServers &&
            typeof onStarted == 'function') {
            onStarted();
        }
    };

    // JAMP asset server
    if (typeof jampAssets === 'object' && typeof jampAssets.port === 'number') {
        // hacks
            jampAssets.port += zone.id;
            jampAssets.location.url += '/zone' + zone.id;
        jamp.start.assetServer(zone, globalNamespace, jampAssets, function () {
            serverReady();
        })
    } else {
        serverReady();
    }

    // Web Server
    if (false) {

    } else {
        serverReady();
    }

    // WebSockets server
    if (false) {//typeof webSockets === 'object' && typeof webSockets.port === 'number') {
        webs.createServer(zone, globalNamespace, webSockets, function () {
            serverReady();
        });
    } else {
        serverReady();
    }    
}