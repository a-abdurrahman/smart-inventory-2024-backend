const routes = (handler) => [
    {
      method: 'POST',
      path: '/owners',
      handler: handler.postOwnerHandler,
    },
    {
      method: 'GET',
      path: '/owners',
      handler: handler.getOwnerHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
    {
      method: 'GET',
      path: '/owners/token',
      handler: handler.getOwnerTokenHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
  ];
   
  module.exports = routes;