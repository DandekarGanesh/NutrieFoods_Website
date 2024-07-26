const emailValidator = require("email-validator");
const userModel = require("../model/user");
const bcrypt = require('bcrypt');
const ExpressError = require("../utils/ExpressError");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");

// render signup form
module.exports.renderSignupForm = (req,res) => {
    res.render("user/signup");
};



// signup
module.exports.signup = async (req,res) => {
   let { firstName, lastName, email, password } = req.body;
   email = email.trim();
   password = password.trim();

   if(!email || !password) {
      throw new ExpressError(400, "Email and password is required");
   }

   const validEmail = emailValidator.validate(email);

   // veryfying Email
   if(!validEmail) {
      throw new ExpressError(400, 'Please provide a valid E-mail ID');
   }

   
   try {
      const userInfo = new userModel(req.body);
      let result = await userInfo.save();

      return res.redirect("/pages");

   } catch(err) {

      // if err.code is 11000 it means the user is exist in DB
      if(err.code == 11000) {
         throw new ExpressError(400, 'Account Already exist with the provided email ID');
      } 

      throw new ExpressError(400, err.message);
   } 

}






// render login page
module.exports.renderLoginPage =  (req,res) => {
    res.render("user/login");
};




// login POST
module.exports.login = async (req,res) => {
     let { email, password } = req.body;
     
     if(!email || !password) {
        throw new ExpressError(400, 'Every Field is Mandatory');
     }

    const validEmail = emailValidator.validate(email);

    if(!validEmail) {
        throw new ExpressError(400, 'please provide a valid email');
    }


    const user = await userModel.findOne({
        email
    }).select('+password');


    if(!user || !(await bcrypt.compare(password, user.password)) ) {
        throw new ExpressError(400, 'Invalid credentials');
    }

    
    try {
        const token = user.jwtToken();
        user.password = undefined;

        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,  // age of the token saved in cookie is 24hrs
            httpOnly: true,
        }

        res.cookie("token", token, cookieOption);
        res.redirect("/pages");

    } catch(err) {
        throw new ExpressError(400, e.message);
    }
    
};







// logout
module.exports.logout = (req,res,next) => {
   try {
     
    const cookieOption = {
        expires: new Date(),
        httpsOnly: true
    };
    
    res.cookie("token", null, cookieOption);

    return res.redirect("/pages");

   } catch(err) {
       throw new ExpressError(400, err.message);
   }

}



// to get user info
module.exports.getUser = async (req,res) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch(err) {
        throw new ExpressError(400, err.message);
    }
}






// render forgot password form
module.exports.renderForgotPaswordPage = (req,res) => {
    res.render("user/forgotPassword");
} 





// forgot password POST route 
module.exports.forgotPassword = async (req,res, next) => {
    let { email } = req.body;

    if(!email) {
        throw new ExpressError(400, 'Email is required');
    }

    const validEmail = emailValidator.validate(email);

    if(!validEmail) {
        throw new ExpressError(400, 'Enter a valid email');
    }

    const user = await userModel.findOne({email});

    if(!user) {
        throw new ExpressError(400, 'Email is not registered');
    }

    const resetToken = await user.generatePasswordResetToken();  
    await user.save();  // here we are saving the created token inside that user


    const resetPasswordURL = `http://localhost:8080/user/reset-password/${resetToken}`;  // this is the URL which we are going to send to the user to reset its password
    const subject = 'Reset Password';
    const message = resetPasswordURL;

    try {
        await sendMail(email, subject, message);
        return res.status(200).json({
            success: true,
            message: "Email send"
        });

    } catch(err) {
 
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiryDate = undefined;
        await user.save();
        
        throw new ExpressError(400, err.message);
    }
}





// Render reset password
module.exports.renderResetPassword = (req,res) => {
    const { resetToken } = req.params;
    res.render("user/resetpassword", { resetToken });
}




// post resetPassword 
module.exports.resetPassword = async (req,res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    if(!password) {
        throw new ExpressError(400, 'Password can not be blank');
    }

    if(!resetToken) {
        throw new ExpressError(400, 'Reset Token is Required');
    }

    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    

    // Here we are finding the user whose forgotPasswordToken == (our forgotPasswordToken) and whose expiry date is greater than current date
    const user = await userModel.findOne({
        forgotPasswordToken,
        forgotPasswordExpiryDate: { $gt: Date.now() }
    });


    if(!user) {
        throw new ExpressError(400, 'Token is invalid or expired, Please try again');
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiryDate = undefined;
    user.save();

    console.log("password Changed");
    
    res.redirect("/pages");
}





// render change password
module.exports.renderChangePassword = (req,res) => {
    res.render("user/changePassword");
}


module.exports.changePassword = async (req,res) => {
    const { oldPassword , newPassword } = req.body;
    const { id } = req.user;

    if(!oldPassword || !newPassword) {
        throw new ExpressError(400, 'All fiels are mandatory');
    }

    const user = await userModel.findById(id).select('+password');

    if(!user) {
        throw new ExpressError(400, 'User does not exist');
    }

    if(!(await bcrypt.compare(oldPassword, user.password))) {
        throw new ExpressError(400, 'Invalid old password');
    }

    user.password = newPassword;
    await user.save();
    user.password = undefined;


    console.log("Password Changed Successfully");

    return res.redirect("/pages");
}



