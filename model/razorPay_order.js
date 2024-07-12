const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const razorPay_orderSchema = new Schema({
    userId: {
        type: String,
    },

    status: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    receipt: {
        type: String
    },

    order_id: {
        type: String,
    },

    payment_id: {
        type: String
    },

    signature: {
        type: String
    }

});


module.exports = mongoose.model("razorPay", razorPay_orderSchema);