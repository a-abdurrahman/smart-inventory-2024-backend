const routes = (handler) => [
    {
      method: 'POST',
      path: '/owners',
      handler: handler.postOwnerHandler,
    },
  ];
   
  module.exports = routes;