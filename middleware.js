const { productSchema, reviewSchema , NavCircleSchema} = require('./schema'); 
const ExpressError = require("./utils/ExpressError");
const JWT = require('jsonwebtoken');


// listing Schema Validation 
module.exports.validateProduct = (req,res,next) => {
    let {error} = productSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}




// review Schema Validation 
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}



// navCircles Schema Validation 
module.exports.validateNavCircle = (req,res,next) => {
    let {error} = NavCircleSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}



// this middleware is to check that the user is logged in or not (isLoggedin)
module.exports.jwtAuth = (req,res, next) => {
    const token = (req.cookies && req.cookies.token) || null;
   
   if(!token) {
       throw new ExpressError(400, 'Not authorized (user is not loggedIn)');
   }

   try {
      const payload = JWT.verify(token, process.env.JWT_secret);
      req.user = { id: payload.id, email: payload.email };

   } catch(err) {

      throw new ExpressError(400, err.message );
   }

   next();
}
