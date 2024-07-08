const express = require("express");
const router = express.Router();
const navCircleController = require("../controllers/navCircle");
const wrapAsync = require("../utils/wrapAsync");
const { validateNavCircle } = require("../middleware");


// CRUD Operations for navCircles

// Render form to create a navCircle
router.get('/add', wrapAsync(navCircleController.renderNewForm));



// Create Route for NavCircle
router.post('/add', validateNavCircle, wrapAsync(navCircleController.createNavCircle));

// show route for navCircles
router.get('/:id', wrapAsync(navCircleController.show));



// Render edit form for navCircles
router.get('/edit/:id', wrapAsync(navCircleController.renderEditForm));


// Update route for navCirlces
router.put('/edit/:id', validateNavCircle, wrapAsync(navCircleController.updateNavCircle));


// delete route
router.delete('/delete/:id', wrapAsync(navCircleController.destroyNavCircle));
// CRUD Operations for navCircles End





module.exports = router;