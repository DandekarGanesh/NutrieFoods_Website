const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./model/product");
const Review = require("./model/review");
const NavCircle = require("./model/NavCircle");
const methodOverride = require("method-override");
const cartModel = require("./model/cartModel");
const bodyParser = require('body-parser'); // to parse the data (which we get from api post)

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



// index route
app.get("/", async (req,res) => {
    // console.log(req.sessionID);
    let cards = await Product.find({});
    let navCircles = await NavCircle.find({});
    res.render("./index.ejs", { cards, navCircles });
});



// view all products
app.get("/product/view-all", async (req,res) => {
    let products = await Product.find({});
    res.render("viewAllProducts", { products } );
});





// CRUD OPERATIONS START

// Show Product
app.get("/show/:id", async (req,res) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    let cards = await Product.find({});
    let reviews = await Review.find({productId: id});

    res.render("./show.ejs", { product, cards, reviews });
});


// Create product form
app.get('/product/add', (req,res) => {
    res.render("./addProduct.ejs");
});

// Create product
app.post('/product/add', (req,res) => {
    let data = req.body.Product;
    let newProduct = new Product(data);
    newProduct.save();
    res.redirect('/');
});


// delete product
app.delete('/product/delete/:id', async (req,res)  => {
   let { id } = req.params;
   await Product.findByIdAndDelete(id);
   res.redirect("/");
});


// edit product form
app.get('/product/edit/:id', async (req,res) => {
    let { id } = req.params;
    let product =  await Product.findById(id);
    res.render("edit.ejs", { product });
});


// update product
app.put("/product/edit/:id", async (req,res) => {
   let { id } = req.params;
   await Product.findByIdAndUpdate(id, { ...req.body.Product });
   res.redirect("/");
});

// CRUD OPERATIONS END




// CRUD operations for reviews
// Show route for reviews
app.get('/review-show/:id', async (req,res) => {
    let { id } = req.params;
    let review = await Review.findById(id);
    let product = await Product.find({ _id : review.productId });
    let img = product[0].url;
    res.render('show_review.ejs', { review, img } );
 });


// Create route for reviews
app.post('/review/:productId', (req,res) => {
    let { productId } = req.params;
    let newReview = new Review(req.body.Review);
    newReview.productId = productId;
    newReview.save();
    res.redirect(`/show/${productId}`);
});


// Render edit form for reviews
app.get('/edit-review/:id', async (req,res) => {
    let { id } = req.params;
    let review = await Review.findById(id);
    let product = await Product.find({ _id : review.productId });
    let img = product[0].url;
    res.render("edit_review", { review , img});
});


// Update route for reviews
app.put('/edit-review/:productId/:id', async (req,res) => {
    let { productId, id } = req.params;
    await Review.findByIdAndUpdate( id , {...req.body.Review });
    res.redirect(`/show/${productId}`);
});


// Delete route for reviews
app.delete('/delete-review/:productId/:id', async (req,res) => {
    let { productId, id } = req.params;
    await Review.findByIdAndDelete(id);
    res.redirect(`/show/${productId}`);
});
// CRUD Operations for reviews end



// CRUD Operations for navCircles
// Render form to create a navCircle
app.get('/navCircle/add', (req,res) => {
     res.render("addNavCircle");
});


// Create Route for NavCircle
app.post('/navCircle/add', async (req,res) => {
    let newNavCircle = await NavCircle({...req.body.NavCircle});
    newNavCircle.save();
    res.redirect('/');
});

// show route for navCircles
app.get('/navCircle/:id', async (req,res) => {
    let { id } = req.params;
    let navCircle = await NavCircle.findById(id);
    res.render("show_NavCircle", { navCircle } );
});


// Render edit form for navCircles
app.get('/edit-navCircle/:id', async (req,res) => {
    let { id } = req.params;
    let navCircle = await NavCircle.findById(id); 
    res.render("edit_navCircle", { navCircle } );
});

// Update route for navCirlces
app.put('/edit-navCircle/:id', async (req,res) => {
    let { id } = req.params; 
    await NavCircle.findByIdAndUpdate(id, { ...req.body.navCircle} );
    res.redirect("/");
});


// delete route
app.delete('/delete-navCircle/:id', async (req,res) => {
    let { id } = req.params; 
    await NavCircle.findByIdAndDelete(id);
    res.redirect('/');
});
// CRUD Operations for navCircles End





// add product for add to cart
app.post("/add-to-cart",  async (req,res) => {
    let productId = req.body.productId;
    let s_Id = req.sessionID;

    let existingCart = await cartModel.find({ session_id: `${s_Id}`});

        if(!existingCart || existingCart.length == 0) {
            let newCart = new cartModel({
                session_id: s_Id,
                Products: [{
                    productId: productId,
                    quantity: 1,
                }]
            });

            await newCart.save();

        } else {
            let updatedCart = existingCart;
            let arr =  existingCart[0].Products;

            let arrIdx = -1;
            for(let i=0; i<arr.length; i++) {
                if(arr[i].productId.toString() === productId) {
                    arrIdx = i;
                    break;
                }
            }

            if(arrIdx >= 0) {
                updatedCart[0].Products[arrIdx].quantity += 1;
            } else {
                updatedCart[0].Products.push({
                    productId: productId,
                    quantity: 1,
                });
            }

            await cartModel.findOneAndUpdate( { session_id: `${s_Id}` } , ...updatedCart);
        }


    res.send({worked: true});
});





// render page  add to cart
app.get("/add-to-cart", async (req,res) => {
    let s_Id = req.sessionID;
    let cart = await cartModel.find({session_id: `${s_Id}`});
    let products = [];

    if(cart && cart[0] && cart[0].Products) {
        for(pro in cart[0].Products) {
            let productId = cart[0].Products[pro].productId;
            let p = await Product.findById(productId);
            p.quantity = cart[0].Products[pro].quantity;
            products.push(p);
        }
    }

    res.render("cart.ejs", { products } );
});




// add to cart = increase the quantity
app.put("/add-to-cart-plus", async (req,res) => {
    let productId = req.body.productId;  
    let s_Id = req.sessionID;
    let existingCart = await cartModel.find({ session_id: `${s_Id}`});
    let updatedCart = existingCart;

    let arr = existingCart[0].Products;
    let arrIdx = -1;
    for(let i=0; i<arr.length; i++) {
        if(arr[i].productId.toString() === productId.toString()) {
            arrIdx = i;
            break;
        }
    }

    if(arrIdx >= 0) {
        updatedCart[0].Products[arrIdx].quantity += 1;
    }
    await cartModel.findOneAndUpdate( { session_id: `${s_Id}` } , ...updatedCart);

    res.send({ updated: "true" });
});




// add to cart = decrease the quantity
app.put("/add-to-cart-minus", async (req,res) => {
    let productId = req.body.productId;   
    let s_Id = req.sessionID;
    let existingCart = await cartModel.find({ session_id: `${s_Id}`});
    let updatedCart = existingCart;

    let arr = existingCart[0].Products;
    let arrIdx = -1;
    for(let i=0; i<arr.length; i++) {
        if(arr[i].productId.toString() === productId.toString()) {
            arrIdx = i;
            break;
        }
    }

    if(arrIdx >= 0) {
        updatedCart[0].Products[arrIdx].quantity -= 1;
    }

    await cartModel.findOneAndUpdate( { session_id: `${s_Id}` } , ...updatedCart);
    res.send({ updated: "true" });
});




// add to cart = delete the product
app.delete("/add-to-cart-delete", async (req,res) => {
    let productId = req.body.productId;     
    let s_Id = req.sessionID;

    let existingCart = await cartModel.find({ session_id: `${s_Id}`});
    let updatedCart = existingCart;
    
    let arr = existingCart[0].Products;
    let arrIdx = -1;
    for(let i=0; i<arr.length; i++) {
        if(arr[i].productId.toString() === productId.toString()) {
            arrIdx = i;
            break;
        }
    }

    if(arrIdx >= 0) {
        updatedCart[0].Products.splice(arrIdx, 1);
    }

    await cartModel.findOneAndUpdate( { session_id: `${s_Id}` } , ...updatedCart);
    res.send({ updated: "true" });
});














// info pages
// about us page
app.get("/pages/about-us", (req,res) => {
    res.render("./info_pages/about-us.ejs");
});

// corporate gifting page
app.get("/pages/corporate-gifting", (req,res) => {
    res.render("./info_pages/corporate-gifting.ejs");
});

// contact page
app.get("/pages/contact", (req,res) => {
    res.render("./info_pages/contact.ejs");
});




app.get("*", (req,res) => {
    res.status(404).send("<h1> Page Not Found </h1>");
});

// listening on port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});