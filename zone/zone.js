/* NODE MODULES */
var eventerface = require('eventerface')
    EventEmitter = require('events').EventEmitter,
    zoneProperties = require('./properties'),
    zoneEvents = require('./events'),
    servers = require('../servers'),
    io = require('socket.io');

/** MODULE INTERFACE
 *@method {function} create - 
 */
module.exports = {
    create: create
};

/*----------------------------------------------------------------------------*/

/** Creates a zone object
 * @param {object} properties - The properties of the zone to be created
 * @returns {object} zone - The created zone object
 */
function create(properties) {
    var zoneNamespace = 'zone_' + properties.id,
        zone = Object.create({
            namespace: zoneNamespace
        }),
        apiNamespace = eventerface.create(),
        apiEmitter = apiNamespace.emitter(),
        localNamespace = eventerface.create(),
        zoneServers = servers.setup(zone);

    // Create event emitters in the same namespace to communicate with the module user
    Object.defineProperties(zone, {
        moduleapi: { value: apiNamespace.emitter() },
        on:     { value: apiEmitter.on },
        emit:   { value: apiEmitter.emit }
    });

    // Configure the JAMP server that will be used by the zone
    if (typeof properties.servers === 'object' && !properties.servers.jamp) {
        properties.servers.jamp = zoneServers.setup.jampServer();
    } else {
        properties.servers = {
            jamp: zoneServers.setup.jampServer()
        };
    }

    // Join the created zone namespace and define the properties of the zone object
    eventerface.find(zoneNamespace, function (zoneNamespace) {
        // Define the properties of the zone object and watch their changes with event listeners
        properties = zoneProperties.define(properties, zoneNamespace, localNamespace);
        Object.defineProperties(zone, properties);
        zoneEvents.watchProperties(zone, zoneNamespace, localNamespace.emitter());
        // Start the zone's servers and emit the 'ready' event
        zoneServers.start.jampServer(function () {
            zoneServers.start.webServer(function () {
                zoneServers.start.webSockets(function () {
                    zone.moduleapi.emit('ready');
                });
            });
        });
    });

    return zone;
}
/*----------------------------------------------------------------------------*/