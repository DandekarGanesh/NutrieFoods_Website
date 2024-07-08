const Joi = require('joi');

module.exports.productSchema = Joi.object({
    Product: Joi.object({
        title: Joi.string().required(),
        Price: Joi.number().required().min(0),
        url: Joi.string().required(),
        description: Joi.string().required(),
        category: Array
    }).required()
});



module.exports.reviewSchema = Joi.object({
    Review: Joi.object({
        rating: Joi.number(),
        comment: Joi.string().required().min(1),
    }).required()
});



module.exports.NavCircleSchema = Joi.object({
    NavCircle: Joi.object({
        title: Joi.string().required(),
        url: Joi.string().required().min(3),
    }).required()
});