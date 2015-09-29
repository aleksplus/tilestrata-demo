var nconf = require('nconf');

nconf.argv();
nconf.env();


var isProduction = nconf.get('NODE_ENV') === 'production';

if (!isProduction) {
  nconf.file('local', {
    file: './config/local.json'
  });
}

if (isProduction) {
  nconf.file('production', {
    file: './config/production.json'
  });
}

nconf.file('main', {
  file: './config/main.json'
});

nconf.defaults({
  isProduction: isProduction,
  isDevelop: !isProduction
});

module.exports = nconf;