"use strict";
require("dotenv").config();
require("@hapi/hoek");
const Hapi = require("@hapi/hapi");
const { routes } = require("./route/routes");
const ClientError = require("./exceptions/ClientError");

const OwnersService = require("./services/postgres/OwnersService");
const OwnersValidator = require("./validator/owners");

const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const init = async () => {
  const ownersService = new OwnersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.Server({
    host: process.env.HOST,
    port: process.env.PORT,
  });
  await server.register([
    {
      plugin: owners,
      options: {
        service: ownersService,
        validator: OwnersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationsService,
        ownersService: ownersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);
  server.route(routes);
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server started on: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
