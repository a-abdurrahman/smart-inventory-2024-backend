const OwnersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'owners',
  version: '1.0.0',
  register: async (server, { service, validator, inviteTokenManager, businessesService }) => {
    const ownersHandler = new OwnersHandler(service, validator, inviteTokenManager, businessesService);
    server.route(routes(ownersHandler));
  },
};