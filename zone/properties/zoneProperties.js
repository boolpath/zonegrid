/* NODE MODULES */
var zoneElements = require('../elements'),
    zoneQuadrants = require('../quadrants'),
    zoneNeighbors = require('../neighbors');

/** MODULE INTERFACE
 *@method {function} define - Defines the properties of a zone and attaches event emitters monitor their changes
 */
module.exports = {
    define: define
};

/*----------------------------------------------------------------------------*/

/** Defines the properties of a zone and attaches event emitters monitor their changes
 * @param {object} properties - Describes the properties of the zone to be created
 * @param {object} globalNamespace - Zonegrid's global namespace for inter-module communication
 * @param {object} localNamespace - Zone module's local namespace for inter-submodule communication
 * @returns {object} zoneProperties - Contains the properties of a zone in Object#defineProperties notation
 */
function define(properties, globalNamespace, localNamespace) {
    // Create an event emitter in the local namespace to report events on changes to properties
    var propertiesEvents = localNamespace.emitter();

    // Return the zoneProperties object
    return (function createZoneProperties() {
        var zoneProperties = {
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
                    x: changeGetterSetter('visibility', 'x', properties.visibility.x),
                    y: changeGetterSetter('visibility', 'y', properties.visibility.y),
                    z: changeGetterSetter('visibility', 'z', properties.visibility.z)
                })
            },
            // Bookin and checkin margin size
            handover: changeGetterSetter('handover', 'handover', properties.handover),
            // Zone scope and handover limits
            margins: {
                value: Object.create({}, {
                    // Scopein and scopeout margins
                    scope: {
                        value: Object.create({}, {
                            inner: marginGetterSetter('innerScope', properties.margins.scope.inner),
                            outer: marginGetterSetter('outerScope', properties.margins.scope.outer)
                        })
                    },
                    // Bookin and checkin margins
                    handover: {
                        value: Object.create({}, {
                            bookin: marginGetterSetter('bookinMargin', properties.margins.handover.bookin),
                            checkin: marginGetterSetter('checkinMargin', properties.margins.handover.checkin)
                        })
                    }
                })
            }
        };
        // Quadrant system derived from the zone's margins
        var quadrants = zoneQuadrants.create(globalNamespace, localNamespace.emitter(), 
                                             zoneProperties.margins.value);
        zoneProperties.quadrants = {
            value: quadrants
        };
        // Set of elements located in the zone
        zoneProperties.elements = zoneElements.createContainer(localNamespace.emitter(), quadrants);
        
        // Neighboring zones
        var neighbors = Object.create({}, zoneNeighbors.createRelationships(properties.neighbors, changeGetterSetter));
        zoneProperties.neighbors = {
            value: function () {
                var neighborLocation = Array.prototype.slice.call(arguments).sort();
                neighborLocation = neighborLocation.join('-');
                neighborLocation = neighborLocation.replace(new RegExp('lower', 'g'), 'l');
                neighborLocation = neighborLocation.replace(new RegExp('middle', 'g'), 'm');
                neighborLocation = neighborLocation.replace(new RegExp('higher', 'g'), 'h');
                neighborLocation = neighborLocation.replace(/\./g, '');
                neighborLocation = neighborLocation.split('-');

                var axes = {
                    x: 0,
                    y: 0,
                    z: 0
                };
                for (var index in neighborLocation) {
                    var segment = neighborLocation[index];
                    for (var axis in axes) {
                        if (segment[0] === axis) {
                            axes[axis] += 1;
                        }
                    }
                }
                for (var axis in axes) {
                    if (axes[axis] === 0) {
                        neighborLocation.push(axis + 'm');
                    }
                }
                neighborLocation = neighborLocation.sort().join('-');
                return neighbors[neighborLocation];
            }
        };

        return zoneProperties;
    })();

    /*----------------------------------------------------------------------------*/

    /** Creates a getter/setter property that emits events when the property is set
     * @param {string} typeofChange - The name or type of the associated property
     * @param {string} propertyChanged - A string version of the associated property
     * @param {number/string} initialValue - The initial value of the property
     * @returns {object} - An object with #get and #set function properties
     */
    function changeGetterSetter(typeofChange, propertyChanged, initialValue) {
        var value = initialValue;
        return {
            get: function () {
                return value; 
            },
            set: function (newValue) {
                value = newValue;
                propertiesEvents.emit(typeofChange + 'Change', {
                    property: propertyChanged,
                    value: newValue
                });
            }
        }
    }

    /** Creates a margin object containing x, y and z getter/setter properties the emit events when set
     * @param {string} typeofChange - The name or type of the associated margin property
     * @param {object} margins - An object containing x, y and z properties with 'lower' ahd 'higher' properties
     * @returns {object} - An object with x, y and z properties in Object#create notation
     */
    function marginGetterSetter(typeofChange, margins) {
        // Emit an event on changes to a margin property
            function emitMarginEvent(propertyChanged, side, value) {
                propertiesEvents.emit(typeofChange + 'Change', {
                    property: propertyChanged,
                    side: side,
                    value: value
                });
            }
        // Create a margin object with 'lower' and 'higher' getter/setter properties
        function margin(propertyChanged, margin) {
            return {
                value: Object.create({}, {
                    // Lower margin
                    lower: (function (value) {
                        return {
                            get: function () {
                                return value;
                            },
                            set: function (newValue) {
                                value = newValue;
                                emitMarginEvent(propertyChanged, 'lower', newValue);
                            }
                        };
                    })(margin.lower),
                    // Higher margin
                    higher: (function (value) {
                        return {
                            get: function () {
                                return value;
                            },
                            set: function (newValue) {
                                value = newValue;
                                emitMarginEvent(propertyChanged, 'higher', newValue);
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
}