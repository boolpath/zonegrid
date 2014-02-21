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
        zoneProperties = createZoneProperties(properties, apiNamespace);

    Object.defineProperties(zone, zoneProperties);

    // Watch and route events on changes to zone properties
    eventerface.find('zone_' + zone.id, function (zoneNamespace) {
        zoneEvents.watchProperties(zoneNamespace, localNamespace.emitter());
        zone.events.emit('ready');
    });

    /*----------------------------------------------------------------------------*/
    
    function createZoneProperties(properties, apiNamespace) {
        var apiEmitter = apiNamespace.emitter();

        var properties = {
            // ID of the zone
            id: {
                value: properties.id
            },
            // Name of the zone
            name: changeGetterSetter('name', 'name', properties.name),
            // Size of the zone
            size: {
                value: Object.create({}, {
                    x: changeGetterSetter('size', 'x', properties.size.x),
                    y: changeGetterSetter('size', 'y', properties.size.y),
                    z: changeGetterSetter('size', 'z', properties.size.z)
                })
            },
            // Zone limits
            limits: marginGetterSetter('limits', properties.limits),
            // Zone center coordinates
            coordinates: {
                value: Object.create({}, {
                    x: changeGetterSetter('coordinates', 'x', properties.coordinates.x),
                    y: changeGetterSetter('coordinates', 'y', properties.coordinates.y),
                    z: changeGetterSetter('coordinates', 'z', properties.coordinates.z)
                })
            },
            // Maximum range of visibility
            visibility: {
                value: Object.create({}, {
                    horizontal: changeGetterSetter('visibility', 'horizontal', properties.visibility.horizontal),
                    vertical: changeGetterSetter('visibility', 'vertical', properties.visibility.vertical)
                })
            },
            // Bookin and checkin margin size
            handover: changeGetterSetter('handover', 'handover', properties.handover),
            // Zone scope and handover limits
            margins: {
                value: Object.create({}, {
                    scope: {
                        value: Object.create({}, {
                            inner: marginGetterSetter('innerScope', properties.margins.scope.inner),
                            outer: marginGetterSetter('outerScope', properties.margins.scope.outer)
                        })
                    },
                    handover: {
                        value: Object.create({}, {
                            bookin: marginGetterSetter('bookinMargin', properties.margins.handover.bookin),
                            checkin: marginGetterSetter('checkinMargin', properties.margins.handover.checkin)
                        })
                    }
                })
            },
            elements: createElementsContainer(),

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

    function changeGetterSetter(typeofChange, propertyChanged, initialValue) {
        var value = initialValue;
        return {
            get: function () {
                return value;
            },
            set: function (newValue) {
                value = newValue;
                zoneEmitter.emit(typeofChange + 'Change', {
                    property: propertyChanged,
                    value: newValue
                });
            }
        }
    }

    function marginGetterSetter(typeofChange, margins) {
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
                                zoneEmitter.emit(typeofChange + 'Change', {
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
                                zoneEmitter.emit(typeofChange + 'Change', {
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
                x: margin('x', margins.x),
                y: margin('y', margins.y),
                z: margin('z', margins.z)
            })
        }
    } 

    /*----------------------------------------------------------------------------*/

    function createElementsContainer() {
        var elements = {},
            getMethods = function (container) {
                return {
                    add: { value: addElement.bind(container) },
                    remove: { value: removeElement.bind(container) }
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

    function addElement(element, key) {
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
                value: watchElement(element, zoneEmitter)
            });
            zoneEmitter.emit('addElement', elements[addWith]);
        }

        return addWith;
    }

    function removeElement(key) {
        var elements = this;
        if (typeof elements[key] !== 'object') {
            return false;
        } else { 
            delete elements[key];
            zoneEmitter.emit('removeElement', key);
            return true;
        }
    }

/*----------------------------------------------------------------------------*/
// END OF #CREATE
    return zone;
}
/*----------------------------------------------------------------------------*/