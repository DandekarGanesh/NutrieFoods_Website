const Product = require("../model/product");
const Review = require("../model/review");
const ExpressError = require("../utils/ExpressError");





module.exports.viewAll = async (req,res) => {
    let { category } = req.params;
    let products = await Product.find({});
    res.render("product/viewAllProducts", { products , category } );
}


module.exports.showProduct =  async (req,res) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    let cards = await Product.find({});
    let reviews = await Review.find({productId: id});
    res.render("product/show.ejs", { product, cards, reviews });
}


module.exports.renderNewForm = (req,res) => {
    res.render("product/addProduct.ejs");
}


module.exports.createProduct = (req,res, next) => {
    let url = req.file.path;
    let data = req.body.Product;
    const newProduct = new Product(data);
    newProduct.url = url;
    newProduct.save();
    res.redirect('/product/allProducts');
}


module.exports.destroyProduct = async (req,res)  => {
    let { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/product/allProducts");
}


module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    let product =  await Product.findById(id);
    res.render("product/edit.ejs", { product });
}     


module.exports.updateProduct = async (req,res) => {
    let { id } = req.params;
    const updatedProduct = req.body.Product;
   
    if(typeof req.file !== "undefined") {
        updatedProduct.url = req.file.path;
    }

    await Product.findByIdAndUpdate(id, { ...updatedProduct });    
    res.redirect("/product/allProducts");
}