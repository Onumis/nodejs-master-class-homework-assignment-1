// create and export config vars

var environments = {};

environments.development = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'development',
  'useHttps' : false
};

environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'useHttps' : false
};

var currentEnvironment = ''
if(typeof(process.env.NODE_ENV) == 'string') {
  currentEnvironment = process.env.NODE_ENV.toLowerCase()
}

var environmentToExport = environments.development;
if(typeof(environments[currentEnvironment]) == 'object') {
  environmentToExport = environments[currentEnvironment]
}

module.exports = environmentToExport;
