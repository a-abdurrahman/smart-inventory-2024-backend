const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { mapDBToProducts } = require("../../utils/mapDBToModel");

class ProductsService {
  constructor() {
    this._pool = new Pool();
  }

  async addProduct({ name, quantity, safeQuantity, businessId }) {
    const id = `p-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    console.log({
      id,
      name,
      quantity,
      safeQuantity,
      createdAt,
      updatedAt,
      businessId,
    });
    const query = {
      text: "INSERT INTO products VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [
        id,
        name,
        quantity,
        safeQuantity,
        createdAt,
        updatedAt,
        businessId,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Failed to add product");
    }
    return result.rows[0].id;
  }

  async getProducts({ businessId }) {
    const query = {
      text: "SELECT * FROM products where business_id = $1",
      values: [businessId],
    };

    const result = await this._pool.query(query);
    const rows = result.rows;
    console.log(rows);
    console.log(typeof rows);
    console.log(typeof mapDBToProducts);
    return rows.map(mapDBToProducts);
  }

  async getProductById({ id }) {
    const query = {
      text: "SELECT * FROM products WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Product not found");
    }
    return result.rows.map(mapDBToProducts)[0];
  }

  async editProductById({ id, name, quantity, safeQuantity }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE products SET name = $1, quantity = $2, safe_quantity = $3, updated_at = $4 WHERE id = $5 RETURNING id",
      values: [name, quantity, safeQuantity, updatedAt, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Failed to edit product. Product not found");
    }
  }

  async deleteProductById({ id }) {
    const query = {
      text: "DELETE FROM products WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Failed to delete product. Product not found");
    }
  }
  async verifyProductOwner({ id, businessId }) {
    const query = {
      text: "SELECT * FROM products WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Product not found");
    }
    const product = result.rows[0];
    if (product.business_id !== businessId) {
      throw new AuthorizationError(
        "You are not authorized to access this product"
      );
    }
  }
}

module.exports = ProductsService;
