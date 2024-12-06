const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }
  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError("Failed to add user. Username is in use.");
    }
  }

  async verifyNewEmail(email) {
    const query = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        "Failed to add user. Email has been registered."
      );
    }
  }
  async isCredentialExist({ username, email }) {
    const query = {
      text: "SELECT username, email FROM users WHERE username = $1 OR email = $2",
      values: [username, email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      return false;
    }
    return true;
  }

  async addUser({ username, email, password, businessId }) {
    await this.verifyNewUsername(username);
    await this.verifyNewEmail(email);
    
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id, business_id",
      values: [id, username, email, hashedPassword, businessId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Failed to add user");
    }
    return {
      userId: result.rows[0].id,
      businessId: result.rows[0].business_id,
    };
  }

  async verifyUsersCredential({ username = null, email = null, password }) {
    const query = {
      text: "SELECT id, password, business_id FROM users WHERE username = $1 OR email = $2",
      values: [username, email],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("Wrong credentials");
    }
    const {
      id,
      password: hashedPassword,
      business_id: businessId,
    } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("Wrong credentials");
    }
    return { id, businessId };
  }


  async getUserDetails({ id }) {
    const query = {
      text: "SELECT username, email FROM users WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("Wrong credentials");
    }
    const { username, email } = result.rows[0];

    return { username, email };
  }

  async verifyInviteToken({ token }) {
    const query = {
      text: "SELECT * FROM invites WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Invite token invalid");
    }
    return { inviteToken: result.rows[0].token };
  }
}

module.exports = UsersService;
