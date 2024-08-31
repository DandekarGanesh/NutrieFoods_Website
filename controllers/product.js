const Product = require("../model/product");
const Review = require("../model/review");
const ExpressError = require("../utils/ExpressError");





module.exports.viewAll = async (req,res) => {
    let { category } = req.params;
    let products = await Product.find({});
    res.render("product/viewAllProducts", { products , category } );
}


module.exports.showProduct =  async (req,res) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    let cards = await Product.find({});
    let reviews = await Review.find({productId: id});
    res.render("product/show.ejs", { product, cards, reviews });
}


module.exports.renderNewForm = (req,res) => {
    res.render("product/addProduct.ejs");
}


module.exports.createProduct = (req,res) => {
    let url = req.files[0].path;
    let data = req.body.Product;
    const newProduct = new Product(data);
    newProduct.url = url;
    
    for(let i=1; i<req.files.length; i++) {
        newProduct.images.push(req.files[i].path);
    }

    newProduct.save();
    res.redirect('/product/allProducts');
}


module.exports.destroyProduct = async (req,res)  => {
    let { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/product/allProducts");
}


module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    let product =  await Product.findById(id);
    res.render("product/edit.ejs", { product });
}     


module.exports.updateProduct = async (req,res) => {
    let { id } = req.params;
    const updatedProduct = req.body.Product;
   
    await Product.findByIdAndUpdate(id, { ...updatedProduct });    
    res.redirect("/product/allProducts");
}


module.exports.allProducts = async (req,res) => {
    const allProducts = await Product.find({});
    res.render("product/allProducts", { allProducts });
}



module.exports.renderChangeImage = async (req,res) => {
    const { ProductId, number } = req.params;
    const pro = await Product.findById(ProductId);
    let url = "";

    if(number == 1) {
        url = pro.url;
    } else {
        url = pro.images[number-2];
    }

    res.render("product/editImage.ejs", { url, ProductId, number });
}



module.exports.changeImage = async (req,res) => {
    const { ProductId, number } = req.params;
    let pro = await Product.findById(ProductId);

    if(req.file) {
        if(number == 1) {
            pro.url = req.file.path;
        } else {
           pro.images[number-2] = req.file.path;
        }
    }
   
    await Product.findByIdAndUpdate(ProductId, {...pro}); 
    res.redirect(`/product/edit/${ProductId}`);
}