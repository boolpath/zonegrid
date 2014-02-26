/* NODE MODULES */
var eventerface = require('eventerface'),
    jamp = require('./jamp'),
    webServer = require('./webServer'),
    webSockets = require('./webSockets');

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
        start: start.bind(null, zone),
        setup: {
            jampServer: jamp.setup.bind(null, zone)
        }
    };

    return servers;
}

/** Starts the servers of a given zone
 * @param {function} onStarted - Starts the servers of a zone
 */
function start(zone, onStarted) {
    var startedServers = 0,
        totalServers = 3, 
        jampAssets = zone.servers.jampAssets,
        webserver = zone.servers.webServer,
        websockets = zone.servers.webSockets;
        
    var serverReady = function () {
        if (++startedServers === totalServers &&
            typeof onStarted == 'function') {
            onStarted();
        }
    };

    // JAMP asset server
    if (typeof jampAssets === 'object' && 
        typeof jampAssets.port === 'number' &&
        typeof jampAssets.location === 'object' &&
        typeof jampAssets.location.url === 'string') {
        // hacks
            jampAssets.port += zone.id;
            jampAssets.location.url += '/zone' + zone.id;
        //
        jamp.start.assetServer(zone, jampAssets, function () {
            serverReady();
        })
    } else {
        serverReady();
    }

    // Web server
    if (typeof webserver === 'object' && 
        typeof webserver.port === 'number') {
        // hacks
            webserver.port += zone.id;
        //
        webServer.createServer(zone, webserver, function () {
            serverReady();
        });
    } else {
        serverReady();
    }

    // WebSockets server
    if (typeof websockets === 'object' && typeof websockets.port === 'number') {
        // hacks
            websockets.port += zone.id;
        //
        webSockets.createServer(zone, websockets, function () {
            serverReady();
        });
    } else {
        serverReady();
    }    
}