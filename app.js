const express = require("express");
const productRoutes = require("./routes/product.routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// File app.js cau hinh Express, gan routes va khoi dong server
const app = express();
const port = process.env.PORT || 3000;

// Middleware nay giup Express doc du lieu JSON tu request body
app.use(express.json());

// Tat ca API cua products se bat dau bang /products
app.use("/products", productRoutes);

// Middleware notFound phai dat sau routes de bat endpoint khong ton tai
app.use(notFound);

// Middleware errorHandler dat cuoi cung de bat loi server/database
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
