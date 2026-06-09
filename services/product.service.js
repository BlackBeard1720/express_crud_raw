const pool = require("../db");

async function findAll(keyword) {
  if (keyword) {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE name LIKE ?",
      [`%${keyword}%`],
    );

    return rows;
  }

  const [rows] = await pool.query("SELECT * FROM products");
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

async function create(data) {
  const { name, price, stock, description } = data;

  const [result] = await pool.query(
    "INSERT INTO products (name, price, stock, description) VALUES (?, ?, ?, ?)",
    [name, price, stock || 0, description || null],
  );

  return {
    id: result.insertId,
    name,
    price,
    stock: stock || 0,
    description: description || null,
  };
}

async function update(id, data) {
  const { name, price, stock, description } = data;

  const [result] = await pool.query(
    "UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?",
    [name, price, stock, description || null, id],
  );

  return result.affectedRows > 0;
}

async function partialUpdate(id, data) {
  const oldProduct = await findById(id);

  if (!oldProduct) {
    return null;
  }

  const { name, price, stock, description } = data;

  const newName = name !== undefined ? name : oldProduct.name;
  const newPrice = price !== undefined ? price : oldProduct.price;
  const newStock = stock !== undefined ? stock : oldProduct.stock;
  const newDescription =
    description !== undefined ? description : oldProduct.description;

  await pool.query(
    "UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?",
    [newName, newPrice, newStock, newDescription, id],
  );

  return {
    id: Number(id),
    name: newName,
    price: newPrice,
    stock: newStock,
    description: newDescription,
  };
}

async function remove(id) {
  const [result] = await pool.query("DELETE FROM products WHERE id = ?", f[id]);

  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  partialUpdate,
  remove,
};
