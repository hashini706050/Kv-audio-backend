import Product from "../models/product.js";
import { isItAdmin } from "./userController.js";

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

    try{
        if(isItAdmin(req)){
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

export async function updateProduct(req,res){
    try{

        if(isItAdmin(req)){

            const key = req.params.key;

            const data = req.body;

            await Product.updateOne({key:key}, data)

            res.json({
                message : "proudct updated successfully"
            })
            return;

        }else{
            res.status(403).json({
                message : "You are not authorized to perform this action"
            })
        }
    }catch(error){
        res.status(500).json({
            message : "Failed to get product"
        })
    }
    
}

export async function deleteProduct(req,res){
    try{
        if(isItAdmin(req)){
            const key = req.params.key;

            await Product.deleteOne({key:key})
            res.json({
                message : "Product deleted successfully"
            })

        }else{
            res.status(403).json({
                message : "You are not authorized to perform this action"
            })
        }

    }catch(error){
        res.status(500).json({
            message : "Failed to delete product"
        })
    }
}

export async function getProductKey(req, res) {
    try{
        const key = req.params.key;
        const product = await Product.findOne({key:key})
        if(product == null){
            res.status(404).json({
                message : "Product not found"
            })
            return;
        }
        res.json(product)
        return;
    }catch(e){
        req.status(500).json({
            message : "Failed to get product"
        })
    }
}