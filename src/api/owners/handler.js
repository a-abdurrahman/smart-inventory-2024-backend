const ClientError = require('../../exceptions/ClientError');
 
class OwnersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postOwnersHandler = this.postOwnersHandler.bind(this);
  }
 
  async postOwnersHandler(request, h) {
    this._validator.validateOwnersPayload(request.payload);
    const { username, email, password } = request.payload;
 
    const ownerId = await this._service.addUser({ username, email, password });
 
    const response = h.response({
      status: 'success',
      message: 'Owner successfully added',
      data: {
        ownerId,
      },
    });
    response.code(201);
    return response;
  }
}