// Middleware nay bat route khong ton tai
function notFound(req, res) {
  return res.status(404).json({
    message: "Route not found",
  });
}

module.exports = notFound;
