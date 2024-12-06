class UsersHandler {
  constructor(service, validator, inviteTokenManager, ownersService) {
    this._service = service;
    this._validator = validator;
    this._inviteTokenManager = inviteTokenManager;
    this._ownersService = ownersService;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserHandler = this.getUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUsersPayload(request.payload);
    const { username, email, password, token } = request.payload;
    await this._ownersService.verifyNewEmail(email);
    await this._ownersService.verifyNewUsername(username);
    const { businessId } = this._inviteTokenManager.verifyInviteToken(token);
    console.log({ username, email, password, businessId });
    const { userId } = await this._service.addUser({
      username,
      email,
      password,
      businessId,
    });
    console.log({ userId, businessId });

    const response = h.response({
      status: "success",
      message: "User successfully added",
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
  async getUserHandler(request, h) {
    const { id } = request.auth.credentials;
    const { username, email } = await this._service.getUserDetails({ id: id });
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
}

module.exports = UsersHandler;
