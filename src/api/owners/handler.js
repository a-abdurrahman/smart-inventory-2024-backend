const ClientError = require("../../exceptions/ClientError");

class OwnersHandler {
  constructor(
    service,
    validator,
    inviteTokenManager,
    businessesService,
    usersService
  ) {
    this._service = service;
    this._validator = validator;
    this._inviteTokenManager = inviteTokenManager;
    this._businessesService = businessesService;
    this._usersService = usersService;

    this.postOwnerHandler = this.postOwnerHandler.bind(this);
    this.getOwnerHandler = this.getOwnerHandler.bind(this);
    this.getOwnerTokenHandler = this.getOwnerTokenHandler.bind(this);
  }

  async postOwnerHandler(request, h) {
    this._validator.validateOwnersPayload(request.payload);
    const { businessName, username, email, password } = request.payload;
    await this._usersService.verifyNewEmail(email)
    await this._usersService.verifyNewUsername(username)
    console.log({ businessName, username, email, password });
    const { ownerId, businessId } = await this._service.addOwner({
      username,
      email,
      password,
    });
    console.log({ ownerId, businessId });
    await this._businessesService.addNewBusiness({
      ownerId: ownerId,
      businessName: businessName,
      businessId: businessId,
    });

    const response = h.response({
      status: "success",
      message: "Owner and business successfully added",
      data: {
        ownerId,
      },
    });
    response.code(201);
    return response;
  }
  async getOwnerHandler(request, h) {
    const { id } = request.auth.credentials;
    const { username, email } = await this._service.getOwnerDetails({ id: id });
    console.log({username, email})
    const response = h.response({
      status: "success",
      message: "Identity fetched successfully",
      data: {
        username: username,
        email: email,
      },
    });
    response.code(200);
    return response;
  }
  async getOwnerTokenHandler(request, h) {
    const { id } = request.auth.credentials;
    const { businessId } = await this._service.getBusinessId({
      id: id,
    });
    const token = await this._inviteTokenManager.generateInviteToken({
      businessId,
    });
    const inviteToken = await this._service.saveInviteToken({ token });
    const response = h.response({
      status: "success",
      message: "Invite Token gotten",
      data: {
        inviteToken,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = OwnersHandler;
