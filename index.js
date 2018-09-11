// Primary file for API

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

const config = require('./config');

// instantiate the http server
const httpServer = http.createServer((req, res) => unifiedServer(req, res));

// start the server
httpServer.listen(
  config.httpPort,
  () => console.log(
      `Starting ${config.envName} environment on port ${config.httpPort}`
    )
);

// instantiate the https server
if (config.useHttps) {
  const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
  };
  const httpsServer = https.createServer(
    httpsServerOptions,
    (req, res) => unifiedServer(req, res)
  );

  // start the server
  httpsServer.listen(
    config.httpsPort,
    () => console.log(
        `Starting ${config.envName} environment on port ${config.httpsPort}`
      )
  );
}

// all the server logic for http and https
const unifiedServer = (req, res) => {
  // get URL and parse it
  // const parsedUrl = new URL(req.url);
  const parsedUrl = url.parse(req.url, true);

  // get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // parse query string into an object
  const queryString = parsedUrl.query;

  // get http method
  const method = req.method.toLowerCase();

  // get the headers as an object
  const headers = req.headers;

  // get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => buffer += decoder.write(data));
  req.on('end', () => {
    buffer += decoder.end();

    // log the request
    console.log(
      `Started ${method} for: /${trimmedPath} with params:`,
      queryString
    );
    console.log('Payload: ', buffer);
    console.log('Headers: ', headers);

    // get the proper handler
    let chosenHandler = '';
    if(typeof(router[trimmedPath]) !== 'undefined') {
      chosenHandler = router[trimmedPath];
    } else {
      chosenHandler = handlers.notFound;
    }

    // construct data object to send to handler
    const data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryString,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // route the request to the handler
    chosenHandler(data, (statusCode, payload) => {
      // use the statusCode or default
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // use the payload or default to empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // convert payload into string
      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // log the response
      console.log(`[${statusCode}]`, payloadString);
    });

  });
}

// route handlers
const handlers = {
  notFound: (data, cb) => cb(404),
  hello: (data, cb) => cb(200, {'data' : 'Oh, hi Mark!'}),
}

// router definition
const router = {
  'hello' : handlers.hello
};
