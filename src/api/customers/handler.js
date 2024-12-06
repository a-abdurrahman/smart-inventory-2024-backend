class CustomersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postCustomerHandler = this.postCustomerHandler.bind(this);
    this.getCustomersHandler = this.getCustomersHandler.bind(this);
    this.getCustomerByIdHandler = this.getCustomerByIdHandler.bind(this);
    this.putCustomerByIdHandler = this.putCustomerByIdHandler.bind(this);
    this.deleteCustomerByIdHandler = this.deleteCustomerByIdHandler.bind(this);
  }

  async postCustomerHandler(request, h) {
    this._validator.validateCustomersPayload(request.payload);
    const { name, number, address } = request.payload;
    const { businessId } = request.auth.credentials;
    console.log({
      name: name,
      number: number,
      address: address,
      businessId: businessId,
    });
    const customerId = await this._service.addCustomer({
      name: name,
      number: number,
      address: address,
      businessId: businessId,
    });

    const response = h.response({
      status: "success",
      message: "Successfully added customer",
      data: {
        customerId,
      },
    });
    response.code(201);
    return response;
  }

  async getCustomersHandler(request) {
    const { businessId } = request.auth.credentials;
    const customers = await this._service.getCustomers({
      businessId: businessId,
    });
    return {
      status: "success",
      data: {
        customers,
      },
    };
  }

  async getCustomerByIdHandler(request, h) {
    const { id } = request.params;
    const { businessId } = request.auth.credentials;
    await this._service.verifyCustomerOwner({ id: id, businessId: businessId });
    const customer = await this._service.getCustomerById({ id: id });
    return {
      status: "success",
      data: {
        customer,
      },
    };
  }

  async putCustomerByIdHandler(request, h) {
    console.log('edit')
    this._validator.validateCustomersPayload(request.payload);
    const { name, number, address } = request.payload;
    const { id } = request.params;
    const { businessId } = request.auth.credentials;

    await this._service.verifyCustomerOwner({ id: id, businessId: businessId });
    this._service.editCustomerById({
      id: id,
      name: name,
      number: number,
      address: address,
    });
    console.log({
      id: id,
      name: name,
      number: number,
      address: address,
      businessId: businessId,
    });

    return {
      status: "success",
      message: "Successfully edited customer",
    };
  }

  async deleteCustomerByIdHandler(request, h) {
    const { id } = request.params;
    const { businessId } = request.auth.credentials;

    await this._service.verifyCustomerOwner({ id: id, businessId: businessId });
    this._service.deleteCustomerById({ id: id });

    return {
      status: "success",
      message: "Successfully deleted customer",
    };
  }
}

module.exports = CustomersHandler;
