class AuthenticationsHandler {
  constructor(
    authenticationsService,
    ownersService,
    usersService,
    tokenManager,
    validator
  ) {
    this._authenticationsService = authenticationsService;
    this._ownersService = ownersService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, email, password } = request.payload;
    console.log({ username, email, password });
    let varId, varBusinessId
    try {
      const { id, businessId } =
        await this._ownersService.verifyOwnersCredential({
          username,
          email,
          password,
        });
      varId = id, varBusinessId = businessId
    } catch {
      const { id, businessId } = await this._usersService.verifyUsersCredential(
        { username, email, password }
      );
      varId = id, varBusinessId = businessId
    }

    console.log({ varId, varBusinessId });

    const accessToken = this._tokenManager.generateAccessToken({
      id: varId,
      businessId: varBusinessId,
    });
    const refreshToken = this._tokenManager.generateRefreshToken({
      id: varId,
      businessId: varBusinessId,
    });
    console.log({ accessToken, refreshToken });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: "success",
      message: "Authentication has been added",
      data: {
        accessToken,
        refreshToken,
      },
    });

    return response;
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id, businessId } =
      this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({
      id,
      businessId,
    });
    return {
      status: "success",
      message: "Access Token has been renewed",
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: "success",
      message: "Refresh token has been deleted",
    };
  }
}

module.exports = AuthenticationsHandler;
