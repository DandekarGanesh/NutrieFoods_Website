const Product = require("../model/product");
const NavCircle = require("../model/NavCircle");
const cartModel = require("../model/cartModel");
const disCoupan = require("../model/disCoupan");
const ExpressError = require("../utils/ExpressError");


module.exports.index = async (req,res) => {
    let cards = await Product.find({});
    let navCircles = await NavCircle.find({});
    res.render("./pages/index.ejs", { cards, navCircles });
}


module.exports.about_us = async (req,res) => {
    const cards = await Product.find({});
    res.render("./pages/about-us.ejs", { cards });
}


module.exports.corporate_gifting = async (req,res) => {
    const cards = await Product.find({});
    res.render("./pages/corporate-gifting.ejs", { cards });
}


module.exports.contact = async (req,res) => {
    const cards = await Product.find({});
    res.render("./pages/contact.ejs", { cards });
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



module.exports.showAllDiscountCoupans = async (req,res) => {
    let allCoupans = await disCoupan.find({});
    res.render("pages/all-discount-coupans", { allCoupans });
}


module.exports.renderDisCoupanForm = (req,res) => {
    res.render("pages/createCoupan");
}


module.exports.createDisCoupan = async (req,res) => {
    let { coupan , disPercentage , disOnAbove , minProducts} = req.body;

    if(!coupan || !disPercentage || !disOnAbove || !minProducts) {
        throw new ExpressError(400, "all fileds are required");
    }

    coupan = coupan.toUpperCase();

    const newDiscount = new disCoupan(req.body);
    await newDiscount.save();
    
    res.redirect("/pages/all-discount-coupans");
}


module.exports.destroyCoupan = async (req,res) => {
    const { id } = req.params;
    await disCoupan.findByIdAndDelete(id);

    res.redirect("/pages/all-discount-coupans");
}