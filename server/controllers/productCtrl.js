const Products = require('../models/productModel')

const productCtrl = {
    getProducts: async(req, res) => {
        try{
            const products = await Products.find()
            res.json(products)
        }
        catch(err){
            res.status(500).json({msg: err.message})
        }
    },

    createProduct: async(req, res) =>{
        try{
             const {product_id, title, price, description, content, images, category} = req.body;

             if(!images){
                res.status(400).json({msg: "No image uploaded"})
             }

             const product = await Products.findOne({product_id})

             if(product){
                res.status(400).json({msg: "This product already exists ."})
             }
             const newProduct = new Products({product_id, title: title.toLowerCase(), price, description, content, images, category})
             await newProduct.save()
             res.json({msg: "Product added !"})
        }   
        catch(err){
            res.status(500).json({msg: err.message})
        }
    },

    deleteProduct: async(req, res) => {
        try{
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Product deleted !"})
        }
        catch(err){
            res.status(500).json({msg: err.message})
        }
    },

    updateProduct: async(req, res) => {
        try{
            const {title, price, description, content, images, category} = req.body;

            if(!images){
                res.status(400).json({msg: "No image uploaded"})
            }

            await Products.findByIdAndUpdate({_id:req.params.id}, {
                title: title.toLowerCase(), price, description, content, images, category
            })

            res.json({msg: "Product updated!"})

        }
        catch(err){
            res.status(500).json({msg: err.message})
        }
    }

}

module.exports = productCtrl;