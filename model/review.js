const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment: {
      type: String,
      required: true
    },

    rating: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    }
});


module.exports = mongoose.model("Review", reviewSchema);