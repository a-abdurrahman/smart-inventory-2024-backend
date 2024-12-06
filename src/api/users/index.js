const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator, inviteTokenManager, ownersService}) => {
    const usersHandler = new UsersHandler(service, validator, inviteTokenManager,ownersService);
    server.route(routes(usersHandler));
  },
};