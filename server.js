var _ = require('underscore');
var tilestrata = require('tilestrata');
var disk = require('tilestrata-disk');
var mapnik = require('tilestrata-mapnik');
var vtile = require('tilestrata-vtile');
var vtileraster = require('tilestrata-vtile-raster');
var dependency = require('tilestrata-dependency');
var headers = require('tilestrata-headers');
var jsonp = require('tilestrata-jsonp');
var sharp = require('tilestrata-sharp');
var strata = tilestrata.createServer();

var project = './style.xml';
var cacheDir = './cache';
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
    .route('@3x.png')
        .use(disk({dir: cacheDir + '/osm'}))
        .use(mapnik({
            xml: project,
            tileSize: 3 * 256,
            scale: 3
        }))

    .route('@2x.png')
        .use(disk({dir: cacheDir + '/osm/2x'}))
        .use(mapnik({
            xml: project,
            tileSize: 2 * 256,
            scale: 2
        }))

    .route('.png')
        .use(disk({dir: cacheDir + '/osm'}))
        .use(headers({
            'Cache-Control': 'max-age=3600',
        }))
        //.use(dependency('osm', '@2x.png'))
        //.use(sharp(function(image, sharp) {
        //    return image.resize(256);
        //}))
        .use(mapnik(commonOptions))

    .route('.pbf')
        .use(disk({dir: cacheDir + '/osm'}))
        .use(vtile(vectorOptions))

    .route('.vtile.png')
        .use(disk({dir: cacheDir + '/osm'}))
        .use(vtileraster(commonOptions, {
            tilesource: ['osm', '.pbf']
        }))

    .route('.json')
        .use(jsonp({variable: 'cb'}));

// start accepting requests
strata.listen(8181);
