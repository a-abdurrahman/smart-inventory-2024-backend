const mapDBToProducts = ({
  id,
  name,
  quantity,
  safe_quantity,
  updated_at,
  created_at,
}) => ({
  id,
  name,
  quantity,
  safeQuantity: safe_quantity,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapDBToCustomers = ({ id, name, number, address, business_id }) => ({
  id: id,
  name: name,
  number: number,
  address: address,
});

module.exports = { mapDBToProducts, mapDBToCustomers };
