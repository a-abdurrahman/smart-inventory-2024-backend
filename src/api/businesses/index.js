const NotFoundError = require("../../exceptions/NotFoundError");

module.exports = {
  name: "businesses",
  version: "1.0.0",
  register: async (server, { businessesService }) => {
    server.route([
      {
        method: "GET",
        path: "/businesses",
        handler: async (request, h) => {
          const { businessId } = request.auth.credentials;
          const businessName = await businessesService.getBusinessNameById({
            businessId,
          });

          const response = h.response({
            status: "success",
            data: {
              businessName: businessName,
            },
          });
          response.code(201);
          return response
        },
        options: {
          auth: "smart_inv_jwt",
        },
      },
    ]);
  },
};
