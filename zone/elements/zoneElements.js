/* NODE MODULES */
var watchElement = require('../../watch').element;

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
function createContainer(zoneEmitter) {
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
                    for (var key in elements) {
                        if (elements.hasOwnProperty(key)) {
                            elements[key] = watchElement(elements[key], zoneEmitter);
                        }
                    }
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

    return createElementsContainer();
}