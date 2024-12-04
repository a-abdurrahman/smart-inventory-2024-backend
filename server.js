'use strict';
require('dotenv').config()
require('@hapi/hoek')
const Hapi = require('@hapi/hapi');
const { routes } = require('./src/route/routes');
const ClientError = require('./src/exceptions/ClientError');
const OwnersService = require('./src/services/postgres/OwnersService');
const OwnersValidator = require('./src/validator/owners')

const init = async () => {
    const ownersService = new OwnersService()
    const server = Hapi.Server({
        host: process.env.HOST,
        port: process.env.PORT,
    })
    await server.register([
      {
        plugin: owners,
        options: {
          service: ownersService,
          validator: OwnersValidator,
        },
      },
    ]);
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