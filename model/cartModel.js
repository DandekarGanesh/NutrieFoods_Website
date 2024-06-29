const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    session_id: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60 * 1000,
    },
    
    // Products: {
    //     productId: {
    //         type: Schema.Types.ObjectId,
    //         ref: "Product",
    //         required: true,
    //     },
    //     quantity: {
    //         type: Number,
    //     }
    // }

    Products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number
        }
    }]
});


module.exports = mongoose.model("cartModel", cartSchema);