const router = require('express')();
const disCoupan = require('../model/disCoupan');

router.get("/discount-coupan/:coupan/:numberOfProduct/:amt", async (req,res) => {
     let { coupan , numberOfProduct, amt } = req.params;
     coupan = coupan.toUpperCase();
     const discount = await disCoupan.findOne({coupan});
     
     if(!discount) {
        return res.json({success: false, message: 'Invalid Discount coupan code'});

     } else if(numberOfProduct < discount.minProducts) {
        return res.json({success: false, message: `To avail this coupan purchase min ${discount.minProducts} products`});

     } else if(amt < discount.disOnAbove) {
        return res.json({success: false, message: `To avail this coupan the amt is GREATER than ${discount.disOnAbove} products`});
     }


    return res.json({
        success: true,
        disCode: coupan,
        dis: discount.disPercentage
    });
});



module.exports = router;