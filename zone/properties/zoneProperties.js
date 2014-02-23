/* NODE MODULES */
var zoneElements = require('../elements'),
    zoneQuadrants = require('../quadrants');

/** MODULE INTERFACE
 *@method {function} define - Define the properties of a zone and attach event emitters monitor their changes
 */
module.exports = {
    define: define
};

/*----------------------------------------------------------------------------*/

/** Define the properties of a zone and attach event emitters monitor their changes
 * @param
 * @returns
 */
function define(properties, globalNamespace, localNamespace) {
    var propertiesEvents = localNamespace.emitter();

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
            }
        };

        var quadrants = zoneQuadrants.create(globalNamespace, localNamespace.emitter(), zoneProperties.margins.value);
        zoneProperties.quadrants = {
            value: quadrants
        };

        zoneProperties.elements = zoneElements.createContainer(localNamespace.emitter(), quadrants);

        return zoneProperties;
    })();

    /*----------------------------------------------------------------------------*/

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
                                propertiesEvents.emit(typeofChange + 'Change', {
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
                                propertiesEvents.emit(typeofChange + 'Change', {
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
}