const pool = require('../db');

async function index(req, res) {
  const keyword = req.query.keyword;

  if (keyword) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE name LIKE ?',
      [`%${keyword}%`]
    );

    return res.json(rows);
  }

  const [rows] = await pool.query('SELECT * FROM products');

  res.json(rows);
}

async function show(req, res) {
  const id = req.params.id;

  const [rows] = await pool.query(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  res.json(rows[0]);
}

async function store(req, res) {
  const { name, price, stock, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      message: 'Name and price are required',
    });
  }

  const [result] = await pool.query(
    'INSERT INTO products (name, price, stock, description) VALUES (?, ?, ?, ?)',
    [name, price, stock || 0, description || null]
  );

  res.status(201).json({
    message: 'Product created successfully',
    id: result.insertId,
  });
}

async function update(req, res) {
  const id = req.params.id;
  const { name, price, stock, description } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({
      message: 'Name, price and stock are required',
    });
  }

  const [result] = await pool.query(
    'UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?',
    [name, price, stock, description || null, id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  res.json({
    message: 'Product updated successfully',
  });
}

async function patch(req, res) {
  const id = req.params.id;
  const { name, price, stock, description } = req.body;

  const [rows] = await pool.query(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  const oldProduct = rows[0];

  const newName = name !== undefined ? name : oldProduct.name;
  const newPrice = price !== undefined ? price : oldProduct.price;
  const newStock = stock !== undefined ? stock : oldProduct.stock;
  const newDescription =
    description !== undefined ? description : oldProduct.description;

  await pool.query(
    'UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?',
    [newName, newPrice, newStock, newDescription, id]
  );

  res.json({
    message: 'Product updated partially successfully',
  });
}

async function destroy(req, res) {
  const id = req.params.id;

  const [result] = await pool.query(
    'DELETE FROM products WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({
      message: 'Product not found',
    });
  }

  res.json({
    message: 'Product deleted successfully',
    deletedId: Number(id),
  });
}

module.exports = {
  index,
  show,
  store,
  update,
  patch,
  destroy,
};