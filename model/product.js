const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchma = new Schema({
    title: String,
    Price: Number,
    url: String,
    description: String
});

// productSchem.post("findOneAndDelete", async (product) => {
//     if(product) {
//        await Review.deleteMany({ _id: { $in: listing.reviews } });
//     }
// });


const Product = mongoose.model('Product', productSchma);
module.exports = Product;