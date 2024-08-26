const Razorpay = require('razorpay'); // requiring RazorPay
const cartModel = require('../model/cartModel');
const razorpayModel = require("../model/razorPay_order");


// give Razor key
module.exports.sendRazorKey = (req,res) => {
    res.send({key : process.env.RAZOR_ID});
};


// to get the payment window
module.exports.givePaymentWindow = async (req,res) => {
    let { discountArray, email } = req.body;
    let { amount } = req.params;
    var instance = new Razorpay({
        key_id: process.env.RAZOR_ID,
        key_secret: process.env.RAZOR_SECRET,
    });



    var options = {
        amount: `${amount*100}`,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      
      instance.orders.create(options, async function(err, order) {
         console.log(order);
         console.log(err);
        // saving data into DB
        try {
            // fetching ordered products details
            let products = await cartModel.find({ session_id:  req.sessionID});
            // console.log(products[0].Products);

            let paymentOrder = new razorpayModel(order); 
            paymentOrder.order_id = order.id;
            paymentOrder.Products = products[0].Products;
            paymentOrder.discountArray = discountArray;
            paymentOrder.buyer = email.toLowerCase();  // here we are adding user email into the order
            await paymentOrder.save();
            
            res.send(order);
        } catch(err) {
            console.log(err);
           res.send(err);
        }
          
      });
}





// route to update DB on successful payment  ...PAID...
module.exports.updatePaymentStatus = async (req,res) => {
    let data = req.body;

    // cheking all the id are coming properly or not
    if(data && data.payment_id && data.order_id && data.signature) {
        const orderId = data.order_id;

        const order = await razorpayModel.find({order_id: data.order_id})
        .then(async (order) => {
            order[0].status = "Paid"
            order[0].payment_id = data.payment_id;
            order[0].signature = data.signature;
            let updatedOrder = new razorpayModel(order[0]);
            
            await razorpayModel.findByIdAndUpdate(order[0]._id, { ...updatedOrder })
            .then((res) => {
                console.log("Payment done.. Updated");
            });
             
        })
        .catch((err) => {
            console.log(err);
        });

        
    }

    res.send({worked: "true"});
}


