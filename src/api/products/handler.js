class ProductsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postProductHandler = this.postProductHandler.bind(this);
    this.getProductsHandler = this.getProductsHandler.bind(this);
    this.getProductByIdHandler = this.getProductByIdHandler.bind(this);
    this.putProductByIdHandler = this.putProductByIdHandler.bind(this);
    this.deleteProductByIdHandler = this.deleteProductByIdHandler.bind(this);
  }

  async postProductHandler(request, h) {
    this._validator.validateProductsPayload(request.payload);
    const { name, quantity, safeQuantity } = request.payload;
    const { businessId } = request.auth.credentials;
    console.log({
      name: name,
      quantity: quantity,
      safeQuantity: safeQuantity,
      businessId: businessId,
    });
    const productId = await this._service.addProduct({
      name: name,
      quantity: quantity,
      safeQuantity: safeQuantity,
      businessId: businessId,
    });

    const response = h.response({
      status: "success",
      message: "Successfully added product",
      data: {
        productId,
      },
    });
    response.code(201);
    return response;
  }

  async getProductsHandler(request) {
    const { businessId } = request.auth.credentials;
    const products = await this._service.getProducts({
      businessId: businessId,
    });
    return {
      status: "success",
      data: {
        products,
      },
    };
  }

  async getProductByIdHandler(request, h) {
    const { id } = request.params;
    const { businessId } = request.auth.credentials;
    await this._service.verifyProductOwner({ id: id, businessId: businessId });
    const product = await this._service.getProductById({ id: id });
    return {
      status: "success",
      data: {
        product,
      },
    };
  }

  async putProductByIdHandler(request, h) {
    console.log('edit')
    this._validator.validateProductsPayload(request.payload);
    const { name, quantity, safeQuantity } = request.payload;
    const { id } = request.params;
    const { businessId } = request.auth.credentials;

    await this._service.verifyProductOwner({ id: id, businessId: businessId });
    this._service.editProductById({
      id: id,
      name: name,
      quantity: quantity,
      safeQuantity: safeQuantity,
    });
    console.log({
      id: id,
      name: name,
      quantity: quantity,
      safeQuantity: safeQuantity,
    });

    return {
      status: "success",
      message: "Successfully edited product",
    };
  }

  async deleteProductByIdHandler(request, h) {
    const { id } = request.params;
    const { businessId } = request.auth.credentials;

    await this._service.verifyProductOwner({ id: id, businessId: businessId });
    this._service.deleteProductById({ id: id });

    return {
      status: "success",
      message: "Successfully deleted product",
    };
  }
}

module.exports = ProductsHandler;
