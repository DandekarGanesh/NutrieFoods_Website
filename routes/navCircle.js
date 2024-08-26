const express = require("express");
const router = express.Router();
const navCircleController = require("../controllers/navCircle");
const wrapAsync = require("../utils/wrapAsync");
const { validateNavCircle , isLoggedin, authorizedRoles} = require("../middleware"); 

// for image uploads
const multer  = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({ storage });



// CRUD Operations for navCircles

// Render form to create a navCircle
router.get('/add', 
    isLoggedin, 
    authorizedRoles('ADMIN', 'SUPER-ADMIN'),
    wrapAsync(navCircleController.renderNewForm));


router.get('/all', navCircleController.showAll);


// Create Route for NavCircle
router.post('/add', 
    isLoggedin,
    authorizedRoles('ADMIN', 'SUPER-ADMIN'),
    // validateNavCircle, 
    upload.single("NavCircle[url]"),
    wrapAsync(navCircleController.createNavCircle));


// Render edit form for navCircles
router.get('/edit/:id',
    isLoggedin,
    authorizedRoles('ADMIN', 'SUPER-ADMIN'), 
    wrapAsync(navCircleController.renderEditForm));


// Update route for navCirlces
router.put('/edit/:id', 
    isLoggedin,
    authorizedRoles('ADMIN', 'SUPER-ADMIN'),
    // validateNavCircle, 
    upload.single("NavCircle[url]"),
    wrapAsync(navCircleController.updateNavCircle));


// delete route
router.delete('/delete/:id', 
    isLoggedin,
    authorizedRoles('ADMIN', 'SUPER-ADMIN'),
    wrapAsync(navCircleController.destroyNavCircle));
// CRUD Operations for navCircles End






module.exports = router;