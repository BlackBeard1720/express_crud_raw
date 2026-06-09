const pool = require("../db");
const productService = require("../services/product.service");

async function index(req, res) {
  const keyword = req.query.keyword;
  const products = await productService.findAll(keyword);
  res.json(products);
}

async function show(req, res) {
  const id = req.params.id;

  const product = await productService.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  return res.json(product);
}

async function store(req, res) {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      message: "Name and price are required",
    });
  }

  const product = await productService.create(req.body);
  res.status(201).json({
    message: "Product created successfully",
    product,
  });
}

async function update(req, res) {
  const id = req.params.id;
  const { name, price, stock, description } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({
      message: "Name, price and stock are required",
    });
  }

  const isUpdated = await productService.update(id, req.body);

  if (!isUpdated) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json({
    message: "Product updated successfully",
  });
}

async function patch(req, res) {
  const id = req.params.id;
  const { name, price, stock, description } = req.body;

  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const oldProduct = rows[0];

  const newName = name !== undefined ? name : oldProduct.name;
  const newPrice = price !== undefined ? price : oldProduct.price;
  const newStock = stock !== undefined ? stock : oldProduct.stock;
  const newDescription =
    description !== undefined ? description : oldProduct.description;

  await pool.query(
    "UPDATE products SET name = ?, price = ?, stock = ?, description = ? WHERE id = ?",
    [newName, newPrice, newStock, newDescription, id],
  );

  res.json({
    message: "Product updated partially successfully",
  });
}

async function destroy(req, res) {
  const id = req.params.id;
  const isDeleted = await productService.remove(id);
  if (!isDeleted) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json({
    message: "Product deleted successfully",
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
