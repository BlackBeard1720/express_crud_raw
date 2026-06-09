const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

router.get("/", productController.index);
router.get("/:id", productController.show);
router.post("/", productController.store);
router.put("/:id", productController.update);
router.patch("/:id", productController.patch);
router.delete("/:id", productController.destroy);

module.exports = router;
