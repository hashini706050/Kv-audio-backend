import Product from "../models/product.js";

export async function addProduct(req,res){
    try{
        console.log(req.user)

        if(req.user == null){
            res.status(401).json({message : "Please login and try again"})
            return
        }
    
        if(req.user.role != "admin"){
            res.status(403).json({
                message : "You are not authorized to perform this action"
            }) 
    
        }else{
        const productdata = req.body;
    
        const newProduct = new Product(productdata);
    
        try{
            await newProduct.save();
            res.json({
                message : "Product registered successfully"
            })
    
    
        }catch(error){
            res.status(500).json({
                error : "Product registration failed"
            })
        }
    }}catch(error){
        res.status(500).json({message : "error occured"})
    }
}

export async function getProduct(req,res){

    let isAdmin = false;

    if(req.user != null) {
        if(req.user.role == "admin"){
            isAdmin = true;
        }
    }

    try{
        if(isAdmin){
            const products = await Product.find();
            res.json(products);
            return;
        }else{
            const products = await Product.find
            ({availability:true})
            res.json(products);
            return;
        }
        

    }catch(error){
        res.status(500).json({
            message : "Failed to get product"
        })
    }

}

