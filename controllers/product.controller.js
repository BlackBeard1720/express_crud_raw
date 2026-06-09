const productService = require("../services/product.service");

// Controller chi nhan request, validate don gian, goi service va tra response
function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function validateName(name, isRequired) {
  if (name === undefined) {
    return isRequired ? "Name is required" : null;
  }

  if (isBlank(name)) {
    return "Name must not be empty";
  }

  return null;
}

function validatePrice(price, isRequired) {
  // Dung === undefined de price = 0 van hop le
  if (price === undefined) {
    return isRequired ? "Price is required" : null;
  }

  if (price === null || (typeof price === "string" && price.trim() === "")) {
    return "Price must be a number greater than or equal to 0";
  }

  const numberPrice = Number(price);
  if (Number.isNaN(numberPrice) || numberPrice < 0) {
    return "Price must be a number greater than or equal to 0";
  }

  return null;
}

function validateStock(stock, isRequired) {
  if (stock === undefined) {
    return isRequired ? "Stock is required" : null;
  }

  if (stock === null || (typeof stock === "string" && stock.trim() === "")) {
    return "Stock must be an integer greater than or equal to 0";
  }

  const numberStock = Number(stock);
  if (!Number.isInteger(numberStock) || numberStock < 0) {
    return "Stock must be an integer greater than or equal to 0";
  }

  return null;
}

function validateProductData(data, options = {}) {
  const errors = [];
  data = data || {};
  const { requireAllFields = false } = options;

  const nameError = validateName(data.name, requireAllFields);
  const priceError = validatePrice(data.price, requireAllFields);
  const stockError = validateStock(data.stock, requireAllFields);

  if (nameError) errors.push(nameError);
  if (priceError) errors.push(priceError);
  if (stockError) errors.push(stockError);

  return errors;
}

function normalizeProductData(data) {
  // Chuyen price/stock sang number truoc khi dua xuong service
  const normalized = { ...data };

  if (normalized.name !== undefined) {
    normalized.name = normalized.name.trim();
  }

  if (normalized.price !== undefined) {
    normalized.price = Number(normalized.price);
  }

  if (normalized.stock !== undefined) {
    normalized.stock = Number(normalized.stock);
  }

  return normalized;
}

async function index(req, res) {
  const keyword = req.query.keyword;
  const products = await productService.findAll(keyword);

  return res.json(products);
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
  const data = req.body || {};
  const errors = validateProductData(data, { requireAllFields: false });

  if (data.name === undefined) errors.unshift("Name is required");
  if (data.price === undefined) errors.unshift("Price is required");

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors[0],
    });
  }

  const product = await productService.create(normalizeProductData(data));

  return res.status(201).json({
    message: "Product created successfully",
    product,
  });
}

async function update(req, res) {
  const id = req.params.id;
  const data = req.body || {};
  const errors = validateProductData(data, { requireAllFields: true });

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors[0],
    });
  }

  const product = await productService.update(id, normalizeProductData(data));

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  return res.json({
    message: "Product updated successfully",
    product,
  });
}

async function patch(req, res) {
  const id = req.params.id;
  const data = req.body || {};
  const errors = validateProductData(data, { requireAllFields: false });

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors[0],
    });
  }

  // PATCH khong query database truc tiep, service se tim va merge product cu
  const product = await productService.partialUpdate(
    id,
    normalizeProductData(data),
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  return res.json({
    message: "Product updated partially successfully",
    product,
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

  return res.json({
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
