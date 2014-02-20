/* NODE MODULES */
var eventerface = require('eventerface'),
    zone = require('./zone'),
    grid = require('./grid')
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
    var newZone;

    if (typeof properties !== 'object') {
        properties = defaults.zoneProperties();
    } 
    else {
    // Validate parameters

    }

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