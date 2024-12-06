const routes = (handler) => [
    {
      method: 'POST',
      path: '/products',
      handler: handler.postProductHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
    {
      method: 'GET',
      path: '/products',
      handler: handler.getProductsHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
    {
      method: 'GET',
      path: '/products/{id}',
      handler: handler.getProductByIdHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
    {
      method: 'PUT',
      path: '/products/{id}',
      handler: handler.putProductByIdHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/products/{id}',
      handler: handler.deleteProductByIdHandler,
      options: {
        auth: 'smart_inv_jwt',
      },
    },
  ];
  
  module.exports = routes;