const { Pool } = require("pg");

const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class BusinessesService {
  constructor() {
    this._pool = new Pool();
  }
  async addNewBusiness({ businessId, businessName, ownerId }) {
    const query = {
      text: "INSERT INTO businesses VALUES($1, $2, $3) RETURNING business_id",
      values: [businessId, businessName, ownerId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Failed to add business");
    }
    return result.rows[0].id;
  }
  async editBusinessNameById({ businessId, businessName, ownerId }) {}
  async getBusinessNameById({businessId}){

    const query = {
      text: 'SELECT * FROM businesses WHERE business_id = $1',
      values: [businessId]
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Business name not found');
    }
    return result.rows[0].business_name;
  }
}

module.exports = BusinessesService;
