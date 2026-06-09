const express = require('express');
const pool = require('./db');

const app = express();
const port = 3000;

const productRoutes = require('./routes/product.routes');
app.use(express.json());

app.use('/products', productRoutes);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});