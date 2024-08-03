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
const User = require("./model/user");
const cookieParser = require("cookie-parser");
const databaseConnect = require("./config/databaseConfig");

// Database Connection
databaseConnect();

// Requiring Routes
const productRouter = require("./routes/product");
const add_to_cartRouter = require("./routes/add_to_cart");
const review = require("./routes/review");
const navCircleRouter = require("./routes/navCircle");
const pageRouter = require("./routes/pages");
const paymentsRouter = require("./routes/payments");
const orderRouter = require("./routes/order");
const userRouter = require("./routes/user");
const miscRouter = require("./routes/misc");
const adminRouter = require("./routes/admin");

// sessions
const session = require("express-session");
const { error } = require("console");

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
app.use(cookieParser()); // to parse cookies


// Routes
app.use("/product", productRouter); // Product Rotues
app.use("/add-to-cart", add_to_cartRouter); // add-to-cart Rotues
app.use("/review", review ); // review Rotues
app.use("/navCircle", navCircleRouter ); // navCircleRouter Rotues
app.use("/pages", pageRouter ); // pages Rotues (index page, policy , Terms and conditions)
app.use("/payments", paymentsRouter); // payments route
app.use("/order", orderRouter); // order route
app.use("/user", userRouter); // order route
app.use("/misc", miscRouter); // misc routes
app.use("/admin", adminRouter);
 


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