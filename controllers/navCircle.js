const NavCircle = require("../model/NavCircle");


module.exports.renderNewForm = (req,res) => {
    res.render("navCircle/addNavCircle");
}


module.exports.createNavCircle = async (req,res) => {
    const url = req.file.path;
    let newNavCircle = await NavCircle({...req.body.NavCircle});
    newNavCircle.url = url;
    newNavCircle.save();
    res.redirect('/navCircle/all');
}



module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    let navCircle = await NavCircle.findById(id); 
    res.render("navCircle/edit_navCircle", { navCircle } );
}


module.exports.updateNavCircle = async (req,res) => {
    const url = req.file.path;
    let { id } = req.params; 
    let newNavCircle = await NavCircle.findById(id);
    newNavCircle.url = url;

    await newNavCircle.save();
    res.redirect("/navCircle/all");
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

