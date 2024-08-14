const router = require("express")();
const userModel = require("../model/user");
const product = require("../model/product");
const { isLoggedin, authorizedRoles } = require("../middleware");


router.get("/", async (req,res) => {
    const allUsers = await userModel.find({});
    res.render("Admin/mainPage", { allUsers });
});


// make admin
router.post("/", isLoggedin, authorizedRoles('SUPER-ADMIN'), async (req,res) => {
    const { email } = req.body;

    await userModel.findOneAndUpdate({email: email}, {role: 'ADMIN'})
    .then((res) => {
        // console.log(res);
        res.send({success: true});
    })
    .catch((err) => {
        res.send({success: false, msg: err.message});
    });
    
});



// make user (make ADMIN as user)
router.post("/makeUser", isLoggedin, authorizedRoles('SUPER-ADMIN') , async (req,res) => {
    const { email } = req.body;

    await userModel.findOneAndUpdate({email: email}, {role: 'USER'})
    .then((res) => {
        console.log(res);
        res.send({success: true});
    })
    .catch((err) => {
        res.send({success: false, msg: err.message});
    });
    
}); 



module.exports = router;