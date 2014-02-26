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
function createServer(zone, globalNamespace, options, onReady) {
    var assetLocation = options.location.url;
    http.createServer(function (req, res) {
        var path = assetLocation + req.url;
        fs.stat(path, function(err, stat) {
            if (err) {
                console.log(err);
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