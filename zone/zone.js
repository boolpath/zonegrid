/* NODE MODULES */
var eventerface = require('eventerface'),
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
        localNamespace = eventerface.create(),
        emitter = new localNamespace.emitter(),
        zoneProperties = defineZoneProperties(properties, emitter);

    // Watch and route events on changes to zone properties
    zoneEvents.watchProperties(zone, localNamespace.emitter());

    Object.defineProperties(zone, zoneProperties);

    return zone;
}

function defineZoneProperties(properties, emitter) {
    var properties = {
        // ID of the zone
        id: {
            value: properties.name
        },
        // Name of the zone
        name: {
            writable: true,
            value: properties.name
        },
        // Size of the zone
        size: {
            value: Object.create({}, {
                x: sizeGetSet('x', properties.size.x, emitter),
                y: sizeGetSet('y', properties.size.y, emitter),
                z: sizeGetSet('z', properties.size.z, emitter)
            })
        },
        // Maximum range of visibility
        visibility: {
            value: Object.create({}, {
                horizontal: visibilityGetSet('horizontal', properties.visibility.horizontal, emitter),
                vertical: visibilityGetSet('vertical', properties.visibility.vertical, emitter)
            })
        },
        // Bookin and checkin margin size
        handover: handoverGetSet(properties.handover, emitter),
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
        elements: createElementsContainer(emitter)
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
    if (typeof key === 'string') {
        this[key] = element;
        return true;
    } else if (typeof element.id === 'string') {
        this[element.id] = element;
        return true;
    } else if (typeof element.name === 'string') {
        this[element.name] = element;
        return true;
    }
    return false;
}

function removeElement(emitter, key) {
    var element = this[key];
    if (typeof element !== 'object') {
        return false;
    }
    return delete this[key];
}