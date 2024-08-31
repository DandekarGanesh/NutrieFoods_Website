const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const wrapAsync = require("../utils/wrapAsync");
const { validateProduct } = require("../middleware");
const { isLoggedin, authorizedRoles }  = require("../middleware");
const product = require("../model/product");

// for image uploads
const multer = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({ storage });


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
    // validateProduct, 
    upload.array('products'),
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
    wrapAsync(productController.renderEditForm));


// update product
router.put("/edit/:id", 
    isLoggedin, 
    authorizedRoles('ADMIN', 'SUPER-ADMIN'), 
    // validateProduct, 
    upload.single("Product[image]"),
    wrapAsync(productController.updateProduct));

// CRUD OPERATIONS END


// show all products for admin
router.get("/allProducts", 
    productController.allProducts
);




//---- this route is to edit the single image of a product ----///
router.get("/edit/image/:ProductId/:number", 
    productController.renderChangeImage
);




// put route to update image of a product
router.put("/edit/image/:ProductId/:number", 
    upload.single('image'),
    productController.changeImage,
 );


module.exports = router;
