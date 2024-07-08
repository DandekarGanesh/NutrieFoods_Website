const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pages");
const wrapAsync = require("../utils/wrapAsync");

// index route
router.get("/", wrapAsync(pagesController.index));

// info pages
// about us page
router.get("/about-us", wrapAsync(pagesController.about_us));

// corporate gifting page
router.get("/corporate-gifting", wrapAsync(pagesController.corporate_gifting));

// contact page
router.get("/contact", wrapAsync(pagesController.contact));


// checkout
router.get("/checkouts", wrapAsync(pagesController.checkouts));


module.exports = router;