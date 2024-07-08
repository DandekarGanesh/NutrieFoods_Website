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
    let data = req.body.Product;
    let newProduct = new Product(data);
    newProduct.save();
    res.redirect('/pages');
}


module.exports.destroyProduct = async (req,res)  => {
    let { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/pages");
}


module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    let product =  await Product.findById(id);
    res.render("product/edit.ejs", { product });
}


module.exports.updateProduct = async (req,res) => {
    let { id } = req.params;
    await Product.findByIdAndUpdate(id, { ...req.body.Product });
    res.redirect("/pages");
}