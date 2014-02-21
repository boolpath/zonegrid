/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    element: watchElement
};

/*----------------------------------------------------------------------------*/

/** Modifies an element so that events are emitted when its properties are changed
 * @param {object} emitter - The event emitter that will be used to notify the changes
 * @returns
 */
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
        x: changeGetterSetter('position', 'x', emitter, position.x).call(element),
        y: changeGetterSetter('position', 'y', emitter, position.y).call(element),
        z: changeGetterSetter('position', 'z', emitter, position.z).call(element)
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

function changeGetterSetter(typeofChange, changedProperty, eventEmitter, initialValue) {
    return function () {
        var element = this,
            value = initialValue;
            
        return {
            get: function () {
                return value;
            },
            set: function (newValue) {
                value = newValue;
                eventEmitter.emit(typeofChange + 'Change', {
                    element: element,
                    property: changedProperty, 
                    value: newValue
                });
            }
        }
    };
}