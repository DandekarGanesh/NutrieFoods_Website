const order_model = require('../model/razorPay_order');
const ProductModel = require('../model/product');
const razorpayModel = require("../model/razorPay_order");
const mongoose = require("mongoose");



// show all orders (and also categories)
module.exports.showOrders = async (req,res) => {
    const { type } = req.params; 
    let orders = await razorpayModel.find({});
    res.render("order/allOrders", { orders , type } );
}






// edit route to edit order
module.exports.renderEditOrder =  async (req,res) => {
    let { order_id } = req.params;
    const orderArray = await razorpayModel.find({order_id: order_id });
    const Order = orderArray[0];
    let products = [];
 
    if(Order && Order.Products) {
     for(let i in Order.Products) {
         let obj = {
            Product: await ProductModel.find({_id: Order.Products[i].productId}),
            quantity: Order.Products[i].quantity,
         }
         products.push(obj);
      }
    }

    const order = await razorpayModel.find({order_id: order_id});
    res.render("order/editOrder", { products, order });
};






// show order
module.exports.showOrder = async (req,res) => {
    let { order_id } = req.params; 
    const orderArray = await razorpayModel.find({order_id: order_id });
    const order = orderArray[0];
    let products = [];
 
    if(order && order.Products) {
     for(let i in order.Products) {
         let obj = {
            Product: await ProductModel.find({_id: order.Products[i].productId}),
            quantity: order.Products[i].quantity,
         }
         products.push(obj);
      }
    }
   
    res.render("order/showOrder", { order, products } );
 };







 // delete order
 module.exports.deleteOrder = async (req,res) => {
    let order_id = req.body.orderId;
    let ans = await razorpayModel.deleteOne({order_id : order_id});
    res.send();
};






// update order
module.exports.updateOrder = async (req,res) => {
    let data = req.body;
    let order_id = req.body.order_id;
    let product_id = req.body.product_id;

    let order = await razorpayModel.find({order_id: `${order_id}`});
    // here below we are deletinng the product whose productId == product_id
    let UpdatedArray = order[0].Products.filter((obj) => obj.productId.toString() !== `${product_id}`);  
    order[0].Products = UpdatedArray;


    await razorpayModel.findOneAndUpdate({order_id: `${order_id}`}, ...order)
    .then((response) => {
        res.send({updated: true});
    })
    .catch((err) => {
        console.log(err);
        res.send({updated: false});
    });

};







// Update order (for delivery Details)
module.exports.updateDeliveryDetails = async (req,res) => {
    let data = req.body;
    let order = await razorpayModel.find({order_id: `${data.order_id}`});
    order[0].Delivery = {
        number: data.number,
        date: data.date,
    }


    await razorpayModel.findOneAndUpdate({order_id: `${data.order_id}`}, ...order)
    .then((response) => {
        // console.log(response);
    }) 
    .catch((err) => {
        console.log(err);
    });


    res.redirect(`/order/show/${data.order_id}`);
};








// my orders
module.exports.myOrders = async (req,res) => {
    const myOrders = await razorpayModel.find({buyer: req.user.email});
    let Products = [];

  if(myOrders) {

    for(let i in myOrders) {
         let productArray = [];

        for(let j in myOrders[i].Products) {
            let id = myOrders[i].Products[j].productId;
            let product = await ProductModel.findById(id);
            product.quantity = myOrders[i].Products[j].quantity;  
            productArray.push(product);
        }

        Products.push(productArray);
    }

  }
    
    
    res.render("order/myOrders", { myOrders, Products });
};




