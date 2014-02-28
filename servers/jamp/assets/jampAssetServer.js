/* NODE MODULES */
var http = require('http'),
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
    var assetLocation = options.location.url;
    // Asset folder
    if (options.location.type === 'fs') {
        fs.stat(assetLocation, function(err, stat) {
            if (err && (err.errno == 34 || err.code === 'ENOENT')) { // ENOENT
                fs.mkdir(assetLocation, function (err) {
                
                });
            }
        });
    }

    // HTTP server
    http.createServer(function (req, res) {
        var path = assetLocation + req.url;
        fs.stat(path, function(err, stat) {
            if (err) {
                res.statusCode = 404; // Not found
                res.end();
            } else {
                var fileStream = fs.createReadStream(path);
                fileStream.pipe(res);
            }
        });
    }).listen(options.port, function () {
        console.log('Asset server listening on port ' + options.port);
        onReady();
    });
}