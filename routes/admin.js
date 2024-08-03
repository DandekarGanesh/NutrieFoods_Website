const router = require("express")();


router.get("/", (req,res) => {
    res.render("Admin/mainPage");
});


module.exports = router;