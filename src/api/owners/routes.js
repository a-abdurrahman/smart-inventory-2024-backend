const routes = (handler) => [
    {
      method: 'POST',
      path: '/owners',
      handler: handler.postUserHandler,
    },
  ];
   
  module.exports = routes;