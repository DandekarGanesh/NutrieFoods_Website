const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const disCoupanSchema = new Schema({
    coupan: {
        type: String,
        unique: [true, 'coupan already exist with same name'],
        trim: true,
        required: [true, 'coupan is required'],
    },

    disPercentage: {
        type: Number,
        trim: true,
        required: [true, 'Percentage of discount is required'],
    },

    disOnAbove: {   // minimum amount to apply discount
        type: Number,
        trim: true,
        required: [true, 'Give the minimum amount above which we want to give discount'] 
    },

    minProducts: {    // minimum products to applay discount
        type: Number,
        trim: true,
        required: [true, 'Give the minimum number of prodcuts above which the discount is applicable']
    },

    specificTo: {
        type: String,
        trim: true
    }
});



// make coupan name CAPITAL
disCoupanSchema.pre('save', function (next) {
    this.coupan = this.coupan.toUpperCase();
    next();
});



module.exports = mongoose.model("DisCoupan", disCoupanSchema);