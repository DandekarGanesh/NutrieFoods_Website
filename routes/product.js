const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const wrapAsync = require("../utils/wrapAsync");
const { validateProduct } = require("../middleware");



// view all products
router.get("/view-all/:category", wrapAsync(productController.viewAll));


// CRUD OPERATIONS START
// Show Product
router.get("/show/:id", wrapAsync(productController.showProduct));

// render form... to add new product
router.get('/add', productController.renderNewForm);  

// Create product
router.post('/add', validateProduct, wrapAsync(productController.createProduct));

// delete product
router.delete('/delete/:id', wrapAsync(productController.destroyProduct));

// render edit form for products
router.get('/edit/:id', wrapAsync(productController.renderEditForm));


// update product
router.put("/edit/:id", wrapAsync(productController.updateProduct));

// CRUD OPERATIONS END




module.exports = router;
