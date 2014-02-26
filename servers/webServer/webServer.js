/* NODE MODULES */
var eventerface = require('eventerface'),
    express = require('express');

/** MODULE INTERFACE
 *@method {function} - 
 */
module.exports = {
    createServer: createServer
};

/*----------------------------------------------------------------------------*/

/** 
 * @param
 * @returns
 */
function createServer(zone, options, onReady) {
    eventerface.find(zone.namespace, function (zoneNamespace) {
        onReady();
    });
}