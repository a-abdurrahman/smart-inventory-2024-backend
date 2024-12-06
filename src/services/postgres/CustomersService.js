const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { mapDBToCustomers } = require("../../utils/mapDBToModel");

class CustomersService {
  constructor() {
    this._pool = new Pool();
  }

  async addCustomer({ name, number, address, businessId }) {
    const id = `C-${nanoid(16)}`;
    console.log({ name, number, address });
    const query = {
      text: "INSERT INTO customers VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, number, address, businessId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Failed to add customer");
    }
    return result.rows[0].id;
  }

  async getCustomers({ businessId }) {
    const query = {
      text: "SELECT * FROM customers where business_id = $1",
      values: [businessId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToCustomers);
  }

  async getCustomerById({ id }) {
    const query = {
      text: "SELECT * FROM customers WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Customer not found");
    }
    return result.rows.map(mapDBToCustomers)[0];
  }

  async editCustomerById({ id, name, number, address }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE customers SET name = $1, number = $2, address = $3 WHERE id = $4 RETURNING id",
      values: [name, number, address, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Failed to edit customer. Customer not found");
    }
  }

  async deleteCustomerById({ id }) {
    const query = {
      text: "DELETE FROM customers WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Failed to delete customer. Customer not found");
    }
  }
  async verifyCustomerOwner({ id, businessId }) {
    const query = {
      text: "SELECT * FROM customers WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Customer not found");
    }
    const customer = result.rows[0];
    if (customer.business_id !== businessId) {
      throw new AuthorizationError(
        "You are not authorized to access this customer"
      );
    }
  }
}

module.exports = CustomersService;
