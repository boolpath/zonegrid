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
        zoneProperties = defineZoneProperties(properties, zoneEvents);

    zone = Object.create({}, zoneProperties);

    return zone;
}

function defineZoneProperties(properties, emitter) {
    var message = 'closure';
    var properties = {
        // Size of the zone
        size: {
            value: Object.create({}, {
                x: sizeGetSet('x', properties.size.x, emitter),
                y: sizeGetSet('y', properties.size.y, emitter),
                z: sizeGetSet('z', properties.size.z, emitter)
            })
        },
        visibility: {
            value: Object.create({}, {
                horizontal: visibilityGetSet('horizontal', properties.visibility.horizontal, emitter),
                vertical: visibilityGetSet('vertical', properties.visibility.vertical, emitter)
            })
        },
        handover: handoverGetSet(properties.handover, emitter),
        margins: {
            value: Object.create({}, {
                scope: {
                    value: Object.create({}, {
                        x: createMargin(),
                        y: createMargin(),
                        z: createMargin()
                    })
                },
                handover: {

                }
            })
        }
    };

    return properties;
}

/*----------------------------------------------------------------------------*/

function sizeGetSet(coordinate, value, emitter) {
    var _value = value;
    return {
        get: function () {
            return _value;
        },
        set: function (value) {
            _value = value;
            emitter.emit('sizeChange', {
                coordinate: coordinate,
                value: _value
            });
        }
    }
}

function handoverGetSet(value, emitter) {
    var _value = value;
    return {
        get: function () {
            return _value;
        },
        set: function (value) {
            _value = value;
            emitter.emit('handoverChange', {
                value: _value
            });
        }
    }
}

function visibilityGetSet(type, value, eventEmitter) {
    var _value = value;
    return {
        get: function () {
            return _value;
        },
        set: function (value) {
            _value = value;
            eventEmitter.emit('scopeChange', {
                type: type,
                value: _value
            });
        }
    };
}

function createMargin() {
    return {
        value: Object.create({}, {
            lower: {
                configurable: true,
                value: 0
            },
            higher: {
                configurable: true,
                value: 0
            }
        })
    }
}