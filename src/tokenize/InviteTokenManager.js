const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');
 
const InviteTokenManager = {
  generateInviteToken: (payload) => Jwt.token.generate(payload, process.env.INVITE_TOKEN_KEY),
  verifyInviteToken: (inviteToken) => {
    try {
      const artifacts = Jwt.token.decode(inviteToken);
      Jwt.token.verifySignature(artifacts, process.env.INVITE_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Invite token invalid');
    }
  },
};
 
module.exports = InviteTokenManager;