/* NODE MODULES */
var eventerface = require('eventerface')
    EventEmitter = require('events').EventEmitter,
    zoneEvents = require('./events'),
    watchElement = require('../watch').element;

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
        zoneProperties = createZoneProperties(properties, apiNamespace, zoneEmitter);

    Object.defineProperties(zone, zoneProperties);

    // Watch and route events on changes to zone properties
    eventerface.find('zone_' + zone.id, function (zoneNamespace) {
        zoneEvents.watchProperties(zoneNamespace, localNamespace.emitter());
        zone.events.emit('ready');
    });

    return zone;
}

function createZoneProperties(properties, apiNamespace, zoneEmitter) {
    var apiEmitter = apiNamespace.emitter();

    var properties = {
        // ID of the zone
        id: {
            value: properties.id
        },
        // Name of the zone
        name: (function (name) {
            return {
                get: function () {
                    return name;
                },
                set: function (value) {
                    name = value;
                    zoneEmitter.emit('nameChange', name);
                }
            };
        })(properties.name),
        // Size of the zone
        size: {
            value: Object.create({}, {
                x: sizeGetSet('x', properties.size.x, zoneEmitter),
                y: sizeGetSet('y', properties.size.y, zoneEmitter),
                z: sizeGetSet('z', properties.size.z, zoneEmitter)
            })
        },
        // Zone limits
        limits: {},
        // Zone center coordinates
        coordinates: {},
        // Maximum range of visibility
        visibility: {
            value: Object.create({}, {
                horizontal: visibilityGetSet('horizontal', properties.visibility.horizontal, zoneEmitter),
                vertical: visibilityGetSet('vertical', properties.visibility.vertical, zoneEmitter)
            })
        },
        // Bookin and checkin margin size
        handover: handoverGetSet(properties.handover, zoneEmitter),
        // Zone scope and handover limits
        margins: {
            value: Object.create({}, {
                scope: {
                    value: Object.create({}, {
                        inner: createMargins(properties.margins.scope.inner),
                        outer: createMargins(properties.margins.scope.outer)
                    })
                },
                handover: {
                    value: Object.create({}, {
                        bookin: createMargins(properties.margins.handover.bookin),
                        checkin: createMargins(properties.margins.handover.checkin)
                    })
                }
            })
        },
        elements: createElementsContainer(zoneEmitter),

        // API events
        events: {
            value: apiNamespace.emitter()
        },
        on: {
            value: function (event, callback) {
                apiEmitter.on(event, callback);
            }
        },
        emit: {
            writable: true,
            value: function (event, message) {
                apiEmitter.emit(event, message);
            }
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

function visibilityGetSet(type, value, emitter) {
    var _value = value;
    return {
        get: function () {
            return _value;
        },
        set: function (value) {
            _value = value;
            emitter.emit('scopeChange', {
                type: type,
                value: _value
            });
        }
    };
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

function createMargins(margins) {
    function margin(margin) {
        return {
            value: Object.create({}, {
                lower: {
                    configurable: true,
                    value: margin.lower
                },
                higher: {
                    configurable: true,
                    value: margin.higher
                }
            })
        };
    }
    return { 
        value: Object.create({}, {
            x: new margin(margins.x),
            y: new margin(margins.y),
            z: new margin(margins.z)
        })
    }
}

/*----------------------------------------------------------------------------*/

function createElementsContainer(emitter) {
    var elements = {},
        getMethods = function (container) {
            return {
                add: { value: addElement.bind(container, emitter) },
                remove: { value: removeElement.bind(container, emitter) }
            }
        },
        elementMethods = getMethods(elements);

    Object.defineProperties(elements, elementMethods); 

    return {
        get: function (key) {
            return (typeof key === 'string') ? elements[key] : elements;
        },
        set: function (arrayObject) {
            if (typeof arrayObject === 'object') {
                elements = arrayObject;
                Object.defineProperties(elements, getMethods(elements));
                return true;
            }
            return false;
        }
    };
}

function addElement(emitter, element, key) {
    var elements = this,
        addWith,
        id = element.id,
        name = element.name;

    if (typeof key === 'string' && !elements[key]) {
        addWith = key;
    } else if (typeof id === 'string' && !elements[id]) {
        addWith = id;
    } else if (typeof name === 'string' && !elements[name]) {
        addWith = name;
    }

    if (addWith) {
        Object.defineProperty(elements, addWith, {
            enumerable: true,
            writable: true,
            configurable: true,
            value: watchElement(element, emitter)
        });
        emitter.emit('addElement', elements[addWith]);
    }

    return addWith;
}

function removeElement(emitter, key) {
    var elements = this;
    if (typeof elements[key] !== 'object') {
        return false;
    } else { 
        delete elements[key];
        emitter.emit('removeElement', key);
        return true;
    }
}