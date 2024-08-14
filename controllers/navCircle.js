const NavCircle = require("../model/NavCircle");


module.exports.renderNewForm = (req,res) => {
    res.render("navCircle/addNavCircle");
}


module.exports.createNavCircle = async (req,res) => {
    let newNavCircle = await NavCircle({...req.body.NavCircle});
    newNavCircle.save();
    res.redirect('/pages');
}



module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    let navCircle = await NavCircle.findById(id); 
    res.render("navCircle/edit_navCircle", { navCircle } );
}


module.exports.updateNavCircle = async (req,res) => {
    let { id } = req.params; 
    await NavCircle.findByIdAndUpdate(id, { ...req.body.NavCircle} );
    res.redirect("/pages");
}


module.exports.destroyNavCircle =  async (req,res) => {
    let { id } = req.params; 
    await NavCircle.findByIdAndDelete(id);
    res.redirect('/pages');
}


module.exports.showAll = async (req,res) => {
    let navCircles = await NavCircle.find({});
    res.render("./navCircle/showAll.ejs", { navCircles });
} 

