const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");



// edit route (to edit order)
router.get("/edit/:order_id", orderController.renderEditOrder);


// orders (show all orders :- all , paid , unpaid)
router.get("/:type", orderController.showOrders);


// view order of products (show single order)
router.get("/show/:order_id", orderController.showOrder);


// delete Order
router.delete("/delete", orderController.deleteOrder );


// Update Order
router.put("/update", orderController.updateOrder);


// Update order (for delivery Details)
router.put("/update/delivery-details", orderController.updateDeliveryDetails);
 




module.exports = router;