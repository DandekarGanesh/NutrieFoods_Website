const Product = require("../model/product");
const Review = require("../model/review");

module.exports.showReview = async (req,res) => {
    let { id } = req.params;
    let review = await Review.findById(id);
    let product = await Product.find({ _id : review.productId });
    let img = product[0].url;
    res.render('review/show_review.ejs', { review, img } );
 }


module.exports.createReview =  (req,res) => {
    let { productId } = req.params;
    let newReview = new Review(req.body.Review);
    newReview.productId = productId;
    newReview.save();
    res.redirect(`/product/show/${productId}`);
}


module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    let review = await Review.findById(id);
    let product = await Product.find({ _id : review.productId });
    let img = product[0].url;
    res.render("review/edit_review", { review , img});
}

module.exports.updateReview = async (req,res) => {
    let { productId, id } = req.params;
    await Review.findByIdAndUpdate( id , {...req.body.Review });
    res.redirect(`/product/show/${productId}`);
}


module.exports.destroyReview = async (req,res) => {
    let { productId, id } = req.params;
    await Review.findByIdAndDelete(id);
    res.redirect(`/product/show/${productId}`);
}