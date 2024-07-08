const Product = require("../model/product");
const NavCircle = require("../model/NavCircle");
const cartModel = require("../model/cartModel");


module.exports.index = async (req,res) => {
    let cards = await Product.find({});
    let navCircles = await NavCircle.find({});
    res.render("./pages/index.ejs", { cards, navCircles });
}


module.exports.about_us = (req,res) => {
    res.render("./pages/about-us.ejs");
}


module.exports.corporate_gifting = (req,res) => {
    res.render("./pages/corporate-gifting.ejs");
}


module.exports.contact = (req,res) => {
    res.render("./pages/contact.ejs");
}


module.exports.checkouts = async (req,res) => {
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

    res.render("pages/checkouts", { products } );
}