'use strict';
require('dotenv').config()
require('@hapi/hoek')
const Hapi = require('@hapi/hapi');
const { routes } = require('./src/route/routes');
const ClientError = require('./src/exceptions/ClientError')

const init = async () => {
    
    const server = Hapi.Server({
        host: process.env.HAPI_HOST,
        port: process.env.HAPI_PORT,
    })
    server.route(routes);
    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
    
        if (response instanceof ClientError) {
          const newResponse = h.response({
            status: 'fail',
            message: response.message,
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }
    
        return h.continue;
      });

    await server.start();
    console.log(`Server started on: ${server.info.uri}`);

}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();