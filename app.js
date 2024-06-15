const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./model/product");
const Review = require("./model/review");
const methodOverride = require("method-override");


// Middleware
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true  }));   // middleware to parse post req data
app.use(methodOverride("_method"));  // middle ware  to override the method
app.use(express.static('Assets'));



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
    let cards = await Product.find({});
    res.render("./index.ejs", { cards });
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


// Create product
app.get('/product/add', (req,res) => {
    res.render("./addProduct.ejs");
});

app.post('/product/add', (req,res) => {
    let data = req.body.Product;
    let newProduct = new Product(data);
    newProduct.save();
    res.redirect('/');
});


// delete product
app.delete('/delete/:id', async (req,res)  => {
   let { id } = req.params;
   await Product.findByIdAndDelete(id);
   res.redirect("/");
});


// edit product
app.get('/edit/:id', async (req,res) => {
    let { id } = req.params;
    let product =  await Product.findById(id);
    res.render("edit.ejs", { product });
});

app.put("/edit/:id", async (req,res) => {
   let { id } = req.params;
   await Product.findByIdAndUpdate(id, { ...req.body.Product });
   res.redirect("/");
});


// CRUD OPERATIONS END




// reviews
app.post('/review/:productId', (req,res) => {
    let { productId } = req.params;
    let newReview = new Review(req.body.Review);
    newReview.productId = productId;
    newReview.save();
    res.redirect(`/show/${productId}`);
});


// CRUD operations for
app.get('/review-show/:id', async (req,res) => {
   let { id } = req.params;
   let review = await Review.findById(id);
   let product = await Product.find({ _id : review.productId });
   let img = product[0].url;
   res.render('show_review.ejs', { review, img } );
});


// render edit form
app.get('/edit-review/:id', async (req,res) => {
    let { id } = req.params;
    let review = await Review.findById(id);
    let product = await Product.find({ _id : review.productId });
    let img = product[0].url;
    res.render("edit_review", { review , img});
});


// do edit of review
app.put('/edit-review/:productId/:id', async (req,res) => {
    let { productId, id } = req.params;
    await Review.findByIdAndUpdate( id , {...req.body.Review });
    res.redirect(`/show/${productId}`);
});


//delete review
app.delete('/delete-review/:productId/:id', async (req,res) => {
    let { productId, id } = req.params;
    await Review.findByIdAndDelete(id);
    res.redirect(`/show/${productId}`);
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