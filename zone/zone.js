/* NODE MODULES */
var eventerface = require('eventerface')
    EventEmitter = require('events').EventEmitter,
    zoneProperties = require('./properties'),
    zoneEvents = require('./events');

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
        apiNamespace = eventerface.create(),
        apiEmitter = apiNamespace.emitter(),
        localNamespace = eventerface.create();

    Object.defineProperties(zone, {
        moduleapi: { value: apiNamespace.emitter() },
        on:     { value: apiEmitter.on },
        emit:   { value: apiEmitter.emit }
    });

    // Join the created zone namespace and define the properties of the zone object
    eventerface.find('zone_' + properties.id, function (globalNamespace) {
        zoneEvents.watchProperties(globalNamespace, localNamespace.emitter());
        properties = zoneProperties.define(properties, globalNamespace, localNamespace);
        Object.defineProperties(zone, properties);
        zone.moduleapi.emit('ready');
    });

    return zone;
}
/*----------------------------------------------------------------------------*/