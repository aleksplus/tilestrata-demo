var _ = require('underscore');
var tilestrata = require('tilestrata');
var disk = require('tilestrata-disk');
var mapnik = require('tilestrata-mapnik');
var vtile = require('tilestrata-vtile');
var headers = require('tilestrata-headers');
var strata = tilestrata.createServer();

var config = require('./config.js');
var project = config.get('tiles:xml');
var cacheDir = config.get('tiles:cacheDir');

var commonOptions = {
    xml: project,
    tileSize: 256,
    scale: 1
};
var vectorOptions = _.extend(commonOptions, {
    bufferSize: 128
});

// define layers
strata.layer('osm')
    .route('@2x.png')
        .use(disk.cache({dir: cacheDir + '/osm/2x'}))
        .use(mapnik({
            xml: project,
            tileSize: 2 * 256,
            scale: 2
        }))

    .route('.png')
        .use(disk.cache({dir: cacheDir + '/osm'}))
        .use(headers({
            'Cache-Control': 'max-age=3600'
        }))
        .use(mapnik(commonOptions))

    .route('.pbf')
        .use(disk.cache({dir: cacheDir + '/osm'}))
        .use(vtile(vectorOptions));

// start accepting requests
strata.listen(config.get('tiles:port'));
