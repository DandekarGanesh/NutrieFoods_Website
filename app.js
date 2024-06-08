const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./model/product");


// Middleware
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true  }));   // middleware to parse post req data



// Database Connection
main().then(() => {
    console.log("Connection Made");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Nutrie");
}



// add product
app.get('/product/add', (req,res) => {
    res.render("./addProduct.ejs");
});

app.post('/product/add', (req,res) => {
    let data = req.body.Product;
    let newProduct = new Product(data);
    newProduct.save();
    res.redirect('/');
});


app.get("/product/show/:id", (req,res) => {
    res.render("./show.ejs");
});



// index route
app.get("/", async (req,res) => {
    let cards = await Product.find({});
    res.render("./index.ejs", { cards });
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