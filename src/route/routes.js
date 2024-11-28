const {
  addProduct,
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
} = require("../handler/productHandler");

const routes = [
  {
    method: "POST",
    path: "/products",
    handler: addProduct,
  },
  {
    method: "GET",
    path: "/products",
    handler: getAllProducts,
  },
  {
    method: "GET",
    path: "/products/{id}",
    handler: getProductById,
  },
  {
    method: "PATCH",
    path: "/products/{id}",
    handler: editProduct
  },
  {
    method: "DELETE",
    path: "/products/{id}",
    handler: deleteProduct,
  },
];

module.exports = {routes}
