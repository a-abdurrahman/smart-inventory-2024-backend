"use strict";
require("dotenv").config();
require("@hapi/hoek");
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

const { routes } = require("./route/routes");
const ClientError = require("./exceptions/ClientError");

const owners = require("./api/owners");
const OwnersService = require("./services/postgres/OwnersService");
const OwnersValidator = require("./validator/owners");
const InviteTokenManager = require("./tokenize/InviteTokenManager");

const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

const businesses = require("./api/businesses");
const BusinessesService = require("./services/postgres/BusinessesService");

const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const products = require("./api/products");
const ProductsService = require("./services/postgres/ProductsService");
const ProductsValidator = require("./validator/products");

const init = async () => {
  const ownersService = new OwnersService();
  const usersService = new UsersService();
  const businessesService = new BusinessesService();
  const authenticationsService = new AuthenticationsService();
  const productsService = new ProductsService();

  const server = Hapi.Server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("smart_inv_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        businessId: artifacts.decoded.payload.businessId,
      },
    }),
  });

  await server.register([
    {
      plugin: owners,
      options: {
        service: ownersService,
        validator: OwnersValidator,
        inviteTokenManager: InviteTokenManager,
        businessesService: businessesService,
        usersService: usersService,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationsService,
        ownersService: ownersService,
        usersService: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
        inviteTokenManager: InviteTokenManager,
        ownersService: ownersService,
      },
    },
    {
      plugin: businesses,
      options: {
        businessesService: businessesService,
      },
    },
    {
      plugin: products,
      options: {
        service: productsService,
        validator: ProductsValidator,
      },
    },
  ]);
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
