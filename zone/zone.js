/* NODE MODULES */
var eventerface = require('eventerface');

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
        zoneProperties = defineZoneProperties();

    zone = Object.create({}, zoneProperties);
    zone.size.x = properties.size.x;
    zone.size.y = properties.size.y;

    return zone;
}

function defineZoneProperties() {
    var properties = {
        // Size of the zone
        size: {
            enumerable: true,
            value: Object.create({}, {
                x: {
                    get: function () {
                        return this._value;
                    },
                    set: function (value) {
                        this._value = value;
                    }
                },
                y: {
                    get: function () {
                        return this._value;
                    },
                    set: function (value) {
                        this._value = value;
                    }
                },
                z: {
                    get: function () {
                        return this._value;
                    },
                    set: function (value) {
                        this._value = value;
                    }
                }
            })
        }
    };

    return properties;
}