const Product = require("../model/product");
const cartModel = require("../model/cartModel");



module.exports.renderPage_Add_to_cart = async (req,res) => {
    let s_Id = req.sessionID;
    let cart = await cartModel.find({session_id: `${s_Id}`});
    let products = [];

    if(cart && cart[0] && cart[0].Products) {
        for(pro in cart[0].Products) {
            let productId = cart[0].Products[pro].productId;
            let p = await Product.findById(productId);
            p.quantity = cart[0].Products[pro].quantity;
            products.push(p);
        }
    }

    res.render("cart.ejs", { products } );
}







module.exports.addProductIntoCart =  async (req,res) => {
    let productId = req.body.productId;
    let s_Id = req.sessionID;

    let existingCart = await cartModel.find({ session_id: `${s_Id}`});

        if(!existingCart || existingCart.length == 0) {
            let newCart = new cartModel({
                session_id: s_Id,
                Products: [{
                    productId: productId,
                    quantity: 1,
                }]
            });

            await newCart.save();

        } else {
            let updatedCart = existingCart;
            let arr =  existingCart[0].Products;

            let arrIdx = -1;
            for(let i=0; i<arr.length; i++) {
                if(arr[i].productId.toString() === productId) {
                    arrIdx = i;
                    break;
                }
            }

            if(arrIdx >= 0) {
                updatedCart[0].Products[arrIdx].quantity += 1;
            } else {
                updatedCart[0].Products.push({
                    productId: productId,
                    quantity: 1,
                });
            }

            await cartModel.findOneAndUpdate( { session_id: `${s_Id}` } , ...updatedCart);
        }


    res.send({worked: true});
}




module.exports.increseProductQty = async (req,res) => {
    let productId = req.body.productId;  
    let s_Id = req.sessionID;
    let existingCart = await cartModel.find({ session_id: `${s_Id}`});
    let updatedCart = existingCart;

    let arr = existingCart[0].Products;
    let arrIdx = -1;
    for(let i=0; i<arr.length; i++) {
        if(arr[i].productId.toString() === productId.toString()) {
            arrIdx = i;
            break;
        }
    }

    if(arrIdx >= 0) {
        updatedCart[0].Products[arrIdx].quantity += 1;
    }
    await cartModel.findOneAndUpdate( { session_id: `${s_Id}` } , ...updatedCart);

    res.send({ updated: "true" });
}





module.exports.decreseProductQty = async (req,res) => {
    let productId = req.body.productId;   
    let s_Id = req.sessionID;
    let existingCart = await cartModel.find({ session_id: `${s_Id}`});
    let updatedCart = existingCart;

    let arr = existingCart[0].Products;
    let arrIdx = -1;
    for(let i=0; i<arr.length; i++) {
        if(arr[i].productId.toString() === productId.toString()) {
            arrIdx = i;
            break;
        }
    }

    if(arrIdx >= 0) {
        updatedCart[0].Products[arrIdx].quantity -= 1;
    }

    await cartModel.findOneAndUpdate( { session_id: `${s_Id}` } , ...updatedCart);
    res.send({ updated: "true" });
}





module.exports.deleteProduct = async (req,res) => {
    let productId = req.body.productId;     
    let s_Id = req.sessionID;

    let existingCart = await cartModel.find({ session_id: `${s_Id}`});
    let updatedCart = existingCart;
    
    let arr = existingCart[0].Products;
    let arrIdx = -1;
    for(let i=0; i<arr.length; i++) {
        if(arr[i].productId.toString() === productId.toString()) {
            arrIdx = i;
            break;
        }
    }

    if(arrIdx >= 0) {
        updatedCart[0].Products.splice(arrIdx, 1);
    }

    await cartModel.findOneAndUpdate( { session_id: `${s_Id}` } , ...updatedCart);
    res.send({ updated: "true" });
}





