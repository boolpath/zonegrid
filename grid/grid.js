var zonegrid = require('zonegrid');
var grid = [
    [ 
        {'x.higher-y.middle':'localhost:10100', 'x.middle-y.higher':'localhost:10200', 'x.higher-y.higher':'localhost:10300'}, 
        {'x.lower-y.middle':'localhost:11000',  'x.middle-y.higher':'localhost:11200', 'x.lower-y.higher':'localhost:11300'}
    ],
    [ 
        {'x.higher-y.middle':'localhost:20100', 'x.middle-y.lower':'localhost:20200', 'x.higher-y.lower':'localhost:20300'},
        {'x.lower-y.middle':'localhost:21100',  'x.middle-y.lower':'localhost:21200', 'x.lower-y.lower':'localhost:21300'} 
    ]
];
var zones = [];

function oppositeSides(sides) {
    var opposites = [], parts, side;
    for (var i = 0, length = sides.length; i < length; i++) {
        parts = sides[i].split('.');
        side = parts[1];
        opposites.push(parts[0] + '.' + 
            ((side === 'lower') ? 'higher': (side == 'higher') ? 'lower': side));
    }
    return opposites;
}

function remoteOptions(grid, sideComponents, x, y) {
    var remote, 
        offsetX = (sideComponents[0].indexOf('higher') > 0) ? 1 : (sideComponents[0].indexOf('lower') > 0) ? -1 : 0,
        offsetY = (sideComponents[1].indexOf('higher') > 0) ? 1 : (sideComponents[1].indexOf('lower') > 0) ? -1 : 0,
        opposite;

    if (grid[y + offsetY] && grid[y + offsetY][x + offsetX]) {
        opposite = grid[y + offsetY][x + offsetX][oppositeSides(sideComponents).join('-')];
        remote = {
            host: opposite.split(':')[0],
            port: opposite.split(':')[1]
        };
    }

    return remote;
}

var element = { 
    name: 'foo',
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    file: 'foo.png'
};

for (var i = 0, rows = grid.length; i < rows; i++) {
    for (var j = 0, columns = grid[0].length; j < columns; j++) {
        var zone = zonegrid.createZone();
        var neighbors = grid[i][j];
        for (var side in neighbors) {
            (function (zone, sideComponents, parts, x, y) { 
                var remote = remoteOptions(grid, sideComponents, x, y);
                zone.on('ready', function () {
                    if (!zone.ready) {
                        zone.ready = true;
                        zone.on('/element/event', function (event) {
                            console.log('Zone ' + zone.id + ': ' + event.type);
                        });
                    }
                    if (!zone.neighbors.apply(null, sideComponents).server) {
                        var host  = parts[0],
                            port  = parts[1];
                            
                        zone.neighbors.apply(null, sideComponents).server = {
                            local: {
                                host: host,
                                port: port
                            },
                            remote: remote
                        } 
                    }
                });
            })(zone, side.split('-'), neighbors[side].split(':'), j, i);
        };
        if (!(zones[i] instanceof Array)) {
            zones[i] = [];
        }
        zones[i][j] = zone;
    }
}