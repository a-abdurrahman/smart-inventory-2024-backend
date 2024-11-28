'use strict';
require('dotenv').config()
require('@hapi/hoek')
const Hapi = require('@hapi/hapi');
const { routes } = require('./src/route/routes');

const init = async () => {
    
    const server = Hapi.Server(process.env.HAPI_HOST)
    server.route(routes);

    await server.start();
    console.log(`Server started on: ${server.info.uri}`);

}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();