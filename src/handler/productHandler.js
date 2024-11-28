const { nanoid } = require("nanoid");
const products = require("../static/products");

const addProduct = (request, h) => {
  const { name } = request.payload;
  const id = nanoid();

  const productObj = {
    name: name,
    id: id,
  };
  products.push(productObj);
  const isSuccess = products.filter((product) => product.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Product successfully added",
      data: {
        ...productObj,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Failed to add product",
  });
  response.code(500);
  return response;
};
const getAllProducts = () => ({
  status: "success",
  data: {
    products,
  },
});
const getProductById = (request, h) => {
  const { id } = request.params;
  const product = products.filter((p) => p.id === id)[0];
  console.log(id)
  console.log(products.filter((p) => p.id === id))
  console.log(products)
  if (product !== undefined) {
    return {
      status: 'success',
      data: {
        product,
      },
    };
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Product not found',
  });
  response.code(404);
  return response;
};
const editProduct = (request, h) => {
  const {id} = request.params.id
  const {name} = request.payload
  const index = products.findIndex((product) =>product.id === id);
 
  if (index !== -1) {
    products[index] = {
      ...products[index],
      name
    };
 
    const response = h.response({
      status: 'success',
      message: 'Product successfully edited',
    });
    response.code(200);
    return response;
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Failed to edit product. Product not found',
  });
  response.code(404);
  return response;
};
const deleteProduct = (request, h) => {
  const {id} = request.params.id
  const {name} = request.payload
  const index = products.findIndex((product) =>product.id === id);
 
  if (index !== -1) {
    products.splice(index, 1);
 
    const response = h.response({
      status: 'success',
      message: 'Product successfully deleted',
    });
    response.code(200);
    return response;
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Failed to edit product. Product not found',
  });
  response.code(404);
  return response;
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  editProduct,
  deleteProduct,
};
