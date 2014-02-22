/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    createContainer: createContainer
};

/*----------------------------------------------------------------------------*/

/** Creates a container object for the elements of a zone
 * @param
 * @returns
 */
function createContainer(zoneNamespace) {
    return (function createElementsContainer() {
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
                    for (var key in elements) {
                        if (elements.hasOwnProperty(key)) {
                            elements[key] = watchElement(elements[key], zoneNamespace);
                        }
                    }
                    return true;
                }
                return false;
            }
        };
    })();

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
                value: watchElement(element)
            });
            zoneNamespace.emit('/element/add', elements[addWith]);
        }

        return addWith;
    }

    function removeElement(key) {
        var elements = this;
        if (typeof elements[key] !== 'object') {
            return false;
        } else { 
            delete elements[key];
            zoneNamespace.emit('/element/remove', key);
            return true;
        }
    }

    function watchElement(element, emitter) {
        var watchedElement,
            position;

        // Position
        if (typeof element.position === 'object') {
            position = { 
                x: element.position.x || 0,
                y: element.position.y || 0,
                z: element.position.z || 0
            };
        } else {
            position = { x: 0, y: 0, z: 0 }
        }
        // Try to redefine the position property
        position = Object.create({}, { 
            x: changeGetterSetter('position', 'x', position.x).call(element),
            y: changeGetterSetter('position', 'y', position.y).call(element),
            z: changeGetterSetter('position', 'z', position.z).call(element)
        });
        try {
            Object.defineProperty(element, 'position', { value: position });
            watchedElement = element;
        } catch (e) {
            watchedElement = Object.create(element);
            Object.defineProperty(watchedElement, 'position', position);
        }

        return watchedElement;
    }

    function changeGetterSetter(typeofChange, changedProperty, initialValue) {
        return function () {
            var element = this,
                value = initialValue;
                
            return {
                get: function () {
                    return value;
                },
                set: function (newValue) {
                    value = newValue;
                    zoneNamespace.emit('/element/' + typeofChange + 'Change', {
                        element: element,
                        property: changedProperty, 
                        value: newValue
                    });
                }
            }
        };
    }
}