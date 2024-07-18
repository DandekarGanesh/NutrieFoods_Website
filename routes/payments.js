const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/payments");


//sending razorpay Key
router.get("/api/getKey", paymentsController.sendRazorKey);


// Razorpay payments

// route to get the payment window and do payment
router.get("/create_order/:amount", paymentsController.givePaymentWindow);


// route to update DB on successful payment  ...PAID...
router.post("/update/status", paymentsController.updatePaymentStatus);


// razorpay payment end



module.exports = router;
