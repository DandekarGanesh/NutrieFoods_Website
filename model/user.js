const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true
    },

    lastName: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        required: [true, 'user email is required'],
        lowercase: true,
        unique: [true, 'Email already Registered'],
        trim: true
    },

    password: {
        type: String,
        select: false,
        required: [true, 'password is required']
    },

    forgotPasswordToken: {
        type: String,
    },

    forgotPasswordExpiryDate: {
        type: Date
    }
}, {
    timestamps: true
});



// pre method
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    return next();
});



// our custom methods
userSchema.methods = {
    // method to generate a token
    jwtToken() {
        return JWT.sign(
            { id: this._id, email: this.email },
            process.env.JWT_secret,
            { expiresIn: '24h' }
        );   
    },


    // this method is for to create a random token
    generatePasswordResetToken: async function() {
       const resetToken = crypto.randomBytes(20).toString('hex');

       this.forgotPasswordToken = crypto
           .createHash('sha256')
           .update(resetToken)
           .digest('hex');
    
       this.forgotPasswordExpiryDate = Date.now() + 15 * 60 * 1000;  // this means we are saving expiry date as date.now + 15min

       return resetToken;
    }
}


module.exports = mongoose.model('User', userSchema); 