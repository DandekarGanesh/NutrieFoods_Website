const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const { isLoggedin, authorizedRoles } = require("../middleware");



// edit route (to edit order)
router.get("/edit/:order_id", 
    isLoggedin,
    authorizedRoles('ADMIN', 'SUPER-ADMIN'),
    orderController.renderEditOrder);


// my orders (for custom)
router.get("/myOrders", 
    isLoggedin,
    orderController.myOrders);


// orders (show all orders :- all , paid , unpaid)
router.get("/:type", 
    orderController.showOrders);


// view order of products (show single order)
router.get("/show/:order_id", 
    isLoggedin,
    authorizedRoles('ADMIN', 'SUPER-ADMIN'),
    orderController.showOrder);


// delete Order
router.delete("/delete", 
    isLoggedin,
    authorizedRoles('ADMIN', 'SUPER-ADMIN'),
    orderController.deleteOrder );


// Update Order
router.put("/update", 
    isLoggedin,
    authorizedRoles('ADMIN', 'SUPER-ADMIN'),
    orderController.updateOrder);


// Update order (for delivery Details)
router.put("/update/delivery-details", 
    isLoggedin,
    authorizedRoles('ADMIN', 'SUPER-ADMIN'),
    orderController.updateDeliveryDetails);
 




module.exports = router;