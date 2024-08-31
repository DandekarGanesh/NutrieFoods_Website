const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchma = new Schema({
    title: {
        type: String,
        requied: true
    },

    originalPrice: {
        type: Number,
        required: true
    },

    Price: {
        type: Number,
        required: true
    },

    url: {
        type: String,
        requred: true 
    },

    images: {
        type: Array,
    },

    description: {
        type: String,
        required: true
    },

    category: {}
});

// productSchem.post("findOneAndDelete", async (product) => {
//     if(product) {
//        await Review.deleteMany({ _id: { $in: listing.reviews } });
//     }
// });


const Product = mongoose.model('Product', productSchma);
module.exports = Product;