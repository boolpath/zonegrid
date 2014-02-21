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
        name: changeGetterSetter('name', 'name', properties.name, zoneEmitter),
        // Size of the zone
        size: {
            value: Object.create({}, {
                x: changeGetterSetter('size', 'x', properties.size.x, zoneEmitter),
                y: changeGetterSetter('size', 'y', properties.size.y, zoneEmitter),
                z: changeGetterSetter('size', 'z', properties.size.z, zoneEmitter)
            })
        },
        // Zone limits
        limits: marginGetterSetter('limits', properties.limits, zoneEmitter),
        // Zone center coordinates
        coordinates: {
            value: Object.create({}, {
                x: changeGetterSetter('coordinates', 'x', properties.coordinates.x, zoneEmitter),
                y: changeGetterSetter('coordinates', 'y', properties.coordinates.y, zoneEmitter),
                z: changeGetterSetter('coordinates', 'z', properties.coordinates.z, zoneEmitter)
            })
        },
        // Maximum range of visibility
        visibility: {
            value: Object.create({}, {
                horizontal: changeGetterSetter('visibility', 'horizontal', properties.visibility.horizontal, zoneEmitter),
                vertical: changeGetterSetter('visibility', 'vertical', properties.visibility.vertical, zoneEmitter)
            })
        },
        // Bookin and checkin margin size
        handover: changeGetterSetter('handover', 'handover', properties.handover, zoneEmitter),
        // Zone scope and handover limits
        margins: {
            value: Object.create({}, {
                scope: {
                    value: Object.create({}, {
                        inner: marginGetterSetter('innerScope', properties.margins.scope.inner, zoneEmitter),
                        outer: marginGetterSetter('outerScope', properties.margins.scope.outer, zoneEmitter)
                    })
                },
                handover: {
                    value: Object.create({}, {
                        bookin: marginGetterSetter('bookinMargin', properties.margins.handover.bookin, zoneEmitter),
                        checkin: marginGetterSetter('checkinMargin', properties.margins.handover.checkin, zoneEmitter)
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

function changeGetterSetter(typeofChange, propertyChanged, initialValue, eventEmitter) {
    var value = initialValue;
    return {
        get: function () {
            return value;
        },
        set: function (newValue) {
            value = newValue;
            eventEmitter.emit(typeofChange + 'Change', {
                property: propertyChanged,
                value: newValue
            });
        }
    }
}

function marginGetterSetter(typeofChange, margins, emitter) {
    function margin(propertyChanged, margin) {
        return {
            value: Object.create({}, {
                lower: (function (value) {
                    return {
                        get: function () {
                            return value;
                        },
                        set: function (newValue) {
                            // value = newValue;
                            emitter.emit(typeofChange + 'Change', {
                                property: propertyChanged,
                                side: 'lower',
                                value: newValue
                            });
                        }
                    };
                })(margin.lower),
                higher: (function (value) {
                    return {
                        get: function () {
                            return value;
                        },
                        set: function (newValue) {
                            // value = newValue;
                            emitter.emit(typeofChange + 'Change', {
                                property: propertyChanged,
                                side: 'higher',
                                value: newValue
                            });
                        }
                    };
                })(margin.higher)
            })
        };
    }
    return { 
        value: Object.create({}, {
            x: new margin('x', margins.x),
            y: new margin('y', margins.y),
            z: new margin('z', margins.z)
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