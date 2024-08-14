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
module.exports.isLoggedin = (req,res, next) => {
    const token = (req.cookies && req.cookies.token) || null;
   
   if(!token) {      
       throw new ExpressError(400, 'Not authorized (user is not loggedIn)');
   }

   try {
      const payload = JWT.verify(token, process.env.JWT_secret);
      req.user = { id: payload.id, email: payload.email, role: payload.role };   

   } catch(err) {

      throw new ExpressError(400, err.message );       
   }

   next();
}





// middleware for authorization
module.exports.authorizedRoles = (...roles) => (req,res,next) => {
    console.log(roles);
    console.log(req.user);

    const currentUserRoles = req.user.role;

    if(!roles.includes(currentUserRoles)) {
        throw new ExpressError(403, 'You do not have permission to access this ROUTE');
    } 
        
    next();
}




// this middleware is for to add our into into req.user
module.exports.getUser = (req,res,next) => {
    const token = (req.cookies && req.cookies.token) || null;

    if(!token) {
        next();
    } else {

        try {
            const payload = JWT.verify(token, process.env.JWT_secret);
            req.user = { id: payload.id, email: payload.email, role: payload.role };   
         } catch(err) {
            console.log(err);      
         }
    
        res.locals.currUser = req.user;
        next();
    }
   
}


