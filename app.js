if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}


const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require('body-parser'); // to parse the data (which we get from api post)
const ExpressError = require("./utils/ExpressError");
const Razorpay = require('razorpay'); // requiring RazorPay


const razorpayModel = require("./model/razorPay_order");

// Requiring Routes
const productRouter = require("./routes/product");
const add_to_cartRouter = require("./routes/add_to_cart");
const review = require("./routes/review");
const navCircleRouter = require("./routes/navCircle");
const pageRouter = require("./routes/pages");

// sessions
const session = require("express-session");

const sessionOptions = {
    secret: "mySuperSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // cookie will save for 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions)); // sessions middleware



// Middleware
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true  }));   // middleware to parse post req data
app.use(methodOverride("_method"));  // middle ware  to override the method
app.use(express.static('Assets'));
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json



// Database Connection
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Nutrie");
}





app.use("/product", productRouter); // Product Rotues
app.use("/add-to-cart", add_to_cartRouter); // add-to-cart Rotues
app.use("/review", review ); // review Rotues
app.use("/navCircle", navCircleRouter ); // navCircleRouter Rotues
app.use("/pages", pageRouter ); // pages Rotues (index page, policy , Terms and conditions)





//sending razorKey
app.get("/user/api/getKey", (req,res) => {
    res.send({key : process.env.RAZOR_ID});
});


// testing payments

app.get("/user/create_order/:amount", async (req,res) => {
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
        //  console.log(order);
        // saving data into DB
        try {
            let paymentOrder = new razorpayModel(order); 
            paymentOrder.order_id = order.id;
            await paymentOrder.save();
            res.send(order);
        } catch(err) {
           res.send(err);
        }
          
      });
});




// route to update DB on successful payment
app.post("/update/status", async (req,res) => {
    let data = req.body;

    // cheking all the id are come properly or not
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
});


// testing payment end









app.all("*", (req,res, next) => {
   next(new ExpressError(404, "Page not found!"));
});


// errr handling middleware
app.use((err,req,res,next) => {
    let { statusCode = 500 , message = "something went wrong"} = err;
    res.status(statusCode).render("pages/error.ejs", { message } );
});

// listening on port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});