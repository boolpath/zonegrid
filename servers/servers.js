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
        start: {
            jampServer: startJampServer.bind(null, zone),
            webServer: startWebServer.bind(null, zone),
            webSockets: startWebSocketsServer.bind(null, zone)
        },
        setup: {
            jampServer: jamp.setup.bind(null, zone)
        }
    };

    return servers;
}

function startJampServer(zone, onReady) {
    var jampAssets = zone.servers.jampAssets;
    if (typeof jampAssets === 'object' && 
        typeof jampAssets.port === 'number' &&
        typeof jampAssets.location === 'object' &&
        typeof jampAssets.location.url === 'string') {
        // hacks
            jampAssets.port += zone.id;
            jampAssets.location.url += '/zone' + zone.id;
        //
        jamp.start.assetServer(zone, jampAssets, onReady);
    } else {
        onReady();
    }
}

/**
 *
 */
function startWebServer(zone, onReady) {
    var webserver = zone.servers.webServer;
    if (typeof webserver === 'object' && 
        typeof webserver.port === 'number') {
        // hacks
            webserver.port += zone.id;
        webServer.createServer(zone, webserver, onReady);
    } else {
        onReady();
    }
}

/** Starts the servers of a given zone
 * @param {function} onStarted - Starts the servers of a zone
 */
function startWebSocketsServer(zone, onReady) {
    var websockets = zone.servers.webSockets;
    if (typeof websockets === 'object' && typeof websockets.port === 'number') {
        // hacks
            websockets.port += zone.id;
        webSockets.createServer(zone, websockets, onReady);
    }  else {
        onReady();
    }
}