/* NODE MODULES */
var eventerface = require('eventerface')
    EventEmitter = require('events').EventEmitter,
    zoneProperties = require('./properties'),
    zoneEvents = require('./events'),
    servers = require('../servers');

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
    var zone = Object.create({}),
        globalNamespace = 'zone_' + properties.id,
        apiNamespace = eventerface.create(),
        apiEmitter = apiNamespace.emitter(),
        localNamespace = eventerface.create();

    // Create event emitters in the same namespace to communicate with the module user
    Object.defineProperties(zone, {
        moduleapi: { value: apiNamespace.emitter() },
        on:     { value: apiEmitter.on },
        emit:   { value: apiEmitter.emit }
    });

    // Configure the JAMP server that will be used by the zone
    if (typeof properties.servers === 'object' && !properties.servers.jamp) {
        properties.servers.jamp = servers.create.jampServer(zone, globalNamespace);
    } else {
        properties.servers = {
            jamp: servers.create.jampServer(zone, globalNamespace)
        };
    }

    // Join the created zone namespace and define the properties of the zone object
    eventerface.find(globalNamespace, function (globalNamespace) {
        properties = zoneProperties.define(properties, globalNamespace, localNamespace);
        Object.defineProperties(zone, properties);
        zoneEvents.watchProperties(zone, globalNamespace, localNamespace.emitter());
        servers.start(zone, function () {
            zone.moduleapi.emit('ready');
        });
    });

    return zone;
}
/*----------------------------------------------------------------------------*/