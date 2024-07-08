const express = require("express");
const router = express.Router();
const add_to_cartController = require("../controllers/add_to_cart");
const wrapAsync = require("../utils/wrapAsync");


// add product for add to cart
router.post("/", wrapAsync(add_to_cartController.addProductIntoCart));


// render page  add to cart
router.get("/", wrapAsync(add_to_cartController.renderPage_Add_to_cart));


// add to cart = increase the quantity
router.put("/add-to-cart-plus", wrapAsync(add_to_cartController.increseProductQty));


// add to cart = decrease the quantity
router.put("/add-to-cart-minus", wrapAsync(add_to_cartController.decreseProductQty));


// add to cart = delete the product
router.delete("/add-to-cart-delete", wrapAsync(add_to_cartController.deleteProduct));




module.exports = router;