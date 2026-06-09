const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "minh",
  password: "123456",
  database: "express_crud_db",
});

module.exports = pool;
