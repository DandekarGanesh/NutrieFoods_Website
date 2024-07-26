const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { jwtAuth } = require("../middleware");  // middlware to check that the user is loged in or not
const wrapAsync = require("../utils/wrapAsync");



router.route("/signup")
    .get(userController.renderSignupForm)  // Render Sign up form
    .post(wrapAsync(userController.signup)); // post route for signup



router.route("/login")
    .get(userController.renderLoginPage)   // Render Login page
    .post(wrapAsync(userController.login)); // login


// logout
router.get("/logout", jwtAuth,  wrapAsync(userController.logout));


// getUser
router.get("/", jwtAuth , wrapAsync(userController.getUser));



router.route("/forgot-password")
    .get(userController.renderForgotPaswordPage)  // Render forgot password rorm
    .post(wrapAsync(userController.forgotPassword)); // Post forgot password 



router.route("/reset-password/:resetToken")
    .get(userController.renderResetPassword)  // render reset password form
    .post(wrapAsync(userController.resetPassword));  // Post reset route



router.route("/change-password")
    .get(jwtAuth, userController.renderChangePassword)   // render change password password 
    .post(jwtAuth, wrapAsync(userController.changePassword));  // Post route for change password 



module.exports = router;