/* NODE MODULES */
var eventerface = require('eventerface'),
    zone = require('./zone'),
    defaults = require('./defaults');

/** LOCAL OBJECT 
 * @property {} - 
 */
var ZONEGRID = {
    
};

/** MODULE INTERFACE
 *@method {function} createZone - Creates a zone object after validating the specified properties
 *@method {function} createGrid - Creates a grid object after validating the specified properties
 */
module.exports = {
    createZone: createZone,
    createGrid: createGrid
};

/*----------------------------------------------------------------------------*/

/** Creates a zone object after validating the specified properties
 * @param {object} properties - The properties of the zone to be created
 * @returns {object} newZone - The created zone object
 */
function createZone(properties) {
    var defaultProperties = defaults.zoneProperties(), 
        newZone;

    if (typeof properties !== 'object') {
        properties = defaultProperties;
    } 
    else {
    // Validate parameters

    }

    // Create a global namespace for event-based communication between the zone modules
    eventerface.create('zone_' + properties.id);
    // Create the zone
    newZone = zone.create(properties);

    return newZone;
}

/** Creates a grid object after validating the specified properties
 * @param {object} properties - The properties of the grid to be created
 * @returns {object} newGrid - The created grid object
 */
function createGrid(properties) {
    var newGrid;

    newGrid = grid.create(properties);

    return newGrid;
}