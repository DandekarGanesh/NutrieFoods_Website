const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { isLoggedin } = require("../middleware");  // middlware to check that the user is loged in or not
const wrapAsync = require("../utils/wrapAsync");
const userModel = require("../model/user");



router.route("/signup")
    .get(userController.renderSignupForm)  // Render Sign up form
    .post(wrapAsync(userController.signup)); // post route for signup



router.route("/login")
    .get(userController.renderLoginPage)   // Render Login page
    .post(wrapAsync(userController.login)); // login


// logout
router.get("/logout", isLoggedin,  wrapAsync(userController.logout));


// getUser
router.get("/", isLoggedin , wrapAsync(userController.getUser));



router.route("/forgot-password")
    .get(userController.renderForgotPaswordPage)  // Render forgot password rorm
    .post(wrapAsync(userController.forgotPassword)); // Post forgot password 



router.route("/reset-password/:resetToken")
    .get(userController.renderResetPassword)  // render reset password form
    .post(wrapAsync(userController.resetPassword));  // Post reset route



router.route("/change-password")
    .get(isLoggedin, userController.renderChangePassword)   // render change password password 
    .post(isLoggedin, wrapAsync(userController.changePassword));  // Post route for change password 


router.post("/userExist-create", userController.checkAndCreateUser);



// Show all users
router.get("/allUsers", userController.showAllUsers);


// show all admins from user
router.get("/admin", userController.showAdmins);

// show super user
router.get("/super-admin", userController.showSuperAdmin);



module.exports = router;