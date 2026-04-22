import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async(req,res)=>{
    try{
const {productName, productDesc, productPrice,category,brand}= req.body;
const userId= req.id;
if(!productName || !productDesc || !productPrice || !category || !brand){
    return res.status(400).json({
        success:false,
        message:"All fields are required"
    })
}
let productImg=[]
if(req.files && req.files.length>0){
    for (let file of req.files) {
        const fileUri = getDataUri(file)
        const result = await cloudinary.uploader.upload(fileUri,{
            folder:"mern_products"  //cloudinary folder name
        })
        productImg.push({
            url:result.secure_url,
            public_id:result.public_id
        })
    }
}

// create a product in db
const newProduct= await Product.create({
    userId,
    productName,
    productDesc,
    productPrice,
    category,
    brand,
    productImg,//array of objects[{url,public_id}]
})
return res.status(200).json({
    success:true,
    message:"Product added successfully",
    product:newProduct
})
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })

    }
}

export const getAllProduct = async(__dirname,res)=>{
    try{
        const products= await Product.find()
        if(!products){
            return res.status(400).json({
                success:false,
                message:"No product available",
                products:[]
            })
        }
        return res.status(200).json({
            success:true,
            products
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const deleteProduct = async(req,res)=>{
    try{
const {productId}= req.params;
const product = await Product.findById(productId)
if(!product){
    return res.status(404).json({
        success:false,
        message:"Product not found"
    })
}
//delete from cloudinary
 if(product.productImg && product.productImg.length>0){
    for (let img of product.productImg) {
        const result= await cloudinary.uploader.destroy(img.public_id);
    }
 }
 //delete product from mongodb
await Product.findByIdAndDelete(productId);
return res.status(200).json({
    success:true,
    message:"product deleted successfully"
})
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const updateProduct= async(req,res)=>{
    try{
        const {productId}= req.params;
        const {productName,productDesc,productPrice, category,brand,existingImages}= req.body;
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        let updatedImages=[]

        if(existingImages){
            const keepIds= JSON.parse(existingImages)
            updatedImages= product.productImg.filter((img)=>{
                keepIds.includes(img.public_id)
            })
            const removedImages = product.productImg.filter(
                (img)=>!keepIds.includes(img.public_id)
            )
            for (const img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id)
            }
        }
        else{
            updatedImages= product.productImg
        }

        //upload new image if any
        if(req.files && req.files.length >0){
            for(let file of req.files){
                const fileUri= getDataUri(file)
                const result= await cloudinary.uploader.upload(fileUri,{folder:"mern_products"})
                updatedImages.push({
                    url:result.secure_url,
                    public_id:result.public_id
                })
            }
        }
        //update product 
        product.productName= productName || product.productName
        product.productDesc= productDesc || product.productDesc
        product.productPrice= productPrice || product.productPrice
        product.category= category || product.category
        product.brand= brand || product.brand
        product.productImg= updatedImages
        await product.save()

        return res.status(200).json({
            success:true,
            message:"product updated successfully",
            product
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}