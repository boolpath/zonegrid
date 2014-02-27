/* NODE MODULES */
var eventerface = require('eventerface'),
    eventEmitter = new require('events').EventEmitter,
    express = require('express'),
    http = require('http'),
    fs = require('fs');

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
    var folder = options.folder;
    // eventerface.find(zone.namespace, function (zoneNamespace) {
        fs.stat(folder, function (err, stat) {
            if (err) {

            } else {
                var webServer = express();
                webServer.use(express.static(folder));
                http.createServer(webServer).listen(options.port, function () {
                    console.log('Web server running on port ' + options.port);
                    onReady();
                });
            }
        });
    // });
}