const routes = (handler) => [
    {
      method: 'POST',
      path: '/customers',
      handler: handler.postCustomerHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
    {
      method: 'GET',
      path: '/customers',
      handler: handler.getCustomersHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
    {
      method: 'GET',
      path: '/customers/{id}',
      handler: handler.getCustomerByIdHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
    {
      method: 'PUT',
      path: '/customers/{id}',
      handler: handler.putCustomerByIdHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/customers/{id}',
      handler: handler.deleteCustomerByIdHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
  ];
  
  module.exports = routes;