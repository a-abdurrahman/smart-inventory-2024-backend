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

module.exports = mapDBToProducts;
