const OwnersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'owners',
  version: '1.0.0',
  register: async (server, { service, validator, inviteTokenManager, businessesService, usersService }) => {
    const ownersHandler = new OwnersHandler(service, validator, inviteTokenManager, businessesService, usersService);
    server.route(routes(ownersHandler));
  },
};