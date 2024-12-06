const { CustomersPayloadSchema } = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");
const CustomersValidator = {
  validateCustomersPayload: (payload) => {
    const validationResult = CustomersPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CustomersValidator;
