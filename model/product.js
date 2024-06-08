const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchma = new Schema({
    title: String,
    Price: Number,
    url: String,
    description: String
});


const Product = mongoose.model('Product', productSchma);
module.exports = Product;