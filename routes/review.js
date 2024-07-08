const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview } = require("../middleware");


// CRUD operations for reviews
// Show route for reviews
router.get('/:id', wrapAsync(reviewController.showReview));

// Create route for reviews
router.post('/:productId', validateReview, wrapAsync(reviewController.createReview));

// Render edit form for reviews
router.get('/edit/:id', wrapAsync(reviewController.renderEditForm));

// Update route for reviews
router.put('/edit/:productId/:id', validateReview, wrapAsync(reviewController.updateReview));

// Delete route for reviews
router.delete('/delete/:productId/:id', wrapAsync(reviewController.destroyReview));
// CRUD Operations for reviews end




module.exports = router;