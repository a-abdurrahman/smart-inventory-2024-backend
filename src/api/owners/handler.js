const ClientError = require('../../exceptions/ClientError');
 
class OwnersHandler {
  constructor(service, validator, businessesService) {
    this._service = service;
    this._validator = validator;
    this._businessesService = businessesService;

    this.postOwnerHandler = this.postOwnerHandler.bind(this);
  }
 
  async postOwnerHandler(request, h) {
    this._validator.validateOwnersPayload(request.payload);
    const { businessName, username, email, password } = request.payload;
    console.log({ businessName, username, email, password })
    const { ownerId, businessId } = await this._service.addOwner({ username, email, password });
    console.log({ ownerId, businessId })
    await this._businessesService.addNewBusiness({ ownerId:ownerId, businessName:businessName, businessId:businessId })
 
    const response = h.response({
      status: 'success',
      message: 'Owner and business successfully added',
      data: {
        ownerId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = OwnersHandler;