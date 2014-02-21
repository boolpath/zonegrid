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
        localNamespace = eventerface.create(),
        zoneEmitter = localNamespace.emitter(),
        properties = zoneProperties.define(properties, zoneEmitter, apiNamespace);

    Object.defineProperties(zone, properties);

    // Watch and route events on changes to zone properties
    eventerface.find('zone_' + zone.id, function (zoneNamespace) {
        zoneEvents.watchProperties(zoneNamespace, localNamespace.emitter());
        zone.events.emit('ready');
    });

    return zone;
}
/*----------------------------------------------------------------------------*/