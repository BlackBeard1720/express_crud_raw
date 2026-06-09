const pool = require("../db");

// Service xu ly truy van database va business logic cua products
async function findAll(keyword) {
  if (keyword) {
    // Prepared statement giup truyen tham so an toan hon khi query database
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
  const { name, price, stock = 0, description = null } = data;

  const [result] = await pool.query(
    "INSERT INTO products (name, price, stock, description) VALUES (?, ?, ?, ?)",
    [name, price, stock, description],
  );

  return {
    id: result.insertId,
    name,
    price,
    stock,
    description,
  };
}

async function update(id, data) {
  const oldProduct = await findById(id);

  if (!oldProduct) {
    return null;
  }

  const { name, price, stock, description = null } = data;

  await pool.query(
    "UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?",
    [name, price, stock, description, id],
  );

  return findById(id);
}

async function partialUpdate(id, data) {
  const oldProduct = await findById(id);

  if (!oldProduct) {
    return null;
  }

  // Merge field moi voi product cu de PATCH co the gui thieu field
  const newProduct = {
    name: data.name !== undefined ? data.name : oldProduct.name,
    price: data.price !== undefined ? data.price : oldProduct.price,
    stock: data.stock !== undefined ? data.stock : oldProduct.stock,
    description:
      data.description !== undefined ? data.description : oldProduct.description,
  };

  await pool.query(
    "UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?",
    [
      newProduct.name,
      newProduct.price,
      newProduct.stock,
      newProduct.description,
      id,
    ],
  );

  return findById(id);
}

async function remove(id) {
  // Xoa product bang prepared statement: id duoc truyen trong mang params
  const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);

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
