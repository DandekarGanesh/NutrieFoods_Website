const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment: {
      type: String
    },

    rating: {
        type: Number,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
    
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    }
});


module.exports = mongoose.model("review", reviewSchema);