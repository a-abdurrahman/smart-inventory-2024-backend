const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authentications",
  version: "1.0.0",
  register: async (
    server,
    { authenticationsService, ownersService, usersService, tokenManager, validator }
  ) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      ownersService,
      usersService,
      tokenManager,
      validator
    );
    server.route(routes(authenticationsHandler));
  },
};
