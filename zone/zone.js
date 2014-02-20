/* NODE MODULES */
var eventerface = require('eventerface'),
    EventEmitter = require('events').EventEmitter;

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
    var zone,
        zoneEvents = new EventEmitter(),
        zoneProperties = defineZoneProperties(zoneEvents);

    zone = Object.create({}, zoneProperties);
    zone.size.x = properties.size.x;
    zone.size.y = properties.size.y;

    return zone;
}

function defineZoneProperties(zoneEvents) {
    var message = 'closure';
    var properties = {
        // Size of the zone
        size: {
            value: Object.create({}, {
                x: sizeGetterSetter('x', zoneEvents),
                y: sizeGetterSetter('y', zoneEvents),
                z: sizeGetterSetter('z', zoneEvents)
            })
        },
        margins: {
            value: Object.create({}, {
                scope: {
                    
                },
                handover: {

                }
            })
        }
    };

    return properties;
}

function sizeGetterSetter(coordinate, emitter) {
    return {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
            emitter.emit('sizeChange', {
                coordinate: coordinate,
                value: value
            });
        }
    }
}