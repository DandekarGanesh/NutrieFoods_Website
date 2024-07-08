const { productSchema, reviewSchema , NavCircleSchema} = require('./schema'); 
const ExpressError = require("./utils/ExpressError");


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
