const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const wrapAsync = require("../utils/wrapAsync");
const { validateProduct } = require("../middleware");
const { isLoggedin, authorizedRoles }  = require("../middleware");
const product = require("../model/product");



// view all products
router.get("/view-all/:category", 
    wrapAsync(productController.viewAll));


// CRUD OPERATIONS START
// Show Product
router.get("/show/:id", 
    wrapAsync(productController.showProduct));

// render form... to add new product
router.get('/add',
    isLoggedin,  
    authorizedRoles('ADMIN', 'SUPER-ADMIN'), 
    wrapAsync(productController.renderNewForm));  

// Create product
router.post('/add', 
    isLoggedin,  
    authorizedRoles('ADMIN', 'SUPER-ADMIN'), 
    validateProduct, 
    wrapAsync(productController.createProduct));

// delete product
router.delete('/delete/:id', 
    isLoggedin, 
    authorizedRoles('ADMIN', 'SUPER-ADMIN'), 
    wrapAsync(productController.destroyProduct));

// render edit form for products
router.get('/edit/:id', 
    isLoggedin, 
    authorizedRoles('ADMIN', 'SUPER-ADMIN'), 
    validateProduct, 
    wrapAsync(productController.renderEditForm));


// update product
router.put("/edit/:id", 
    isLoggedin, 
    authorizedRoles('ADMIN', 'SUPER-ADMIN'), 
    validateProduct, 
    wrapAsync(productController.updateProduct));

// CRUD OPERATIONS END


router.get("/allProducts", async (req,res) => {
    const allProducts = await product.find({});
    res.render("product/allProducts", { allProducts });
});


module.exports = router;
