import User from '../models/userModel.js'
import Session from '../models/sessionModel.js'

import 'dotenv/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { verifyEmail } from '../emailverify/verifyEmail.js'


export const register = async(req,res)=>{
    try{
const {firstName, lastName, email,password}=req.body;
if(!firstName || !lastName|| !email|| !password){
    res.status(400).json({
        success:false,
        message:'All fields are required'
    })
}
const user= await User.findOne({email})
if(user){
    res.status(404).json({
        success:false,
        message:'User already exist'
    })
}


const hashedPassword= await bcrypt.hash(password,10)
const newUser= await User.create({
    firstName,
    lastName,
    email,
    password:hashedPassword
})

const token = jwt.sign({id:newUser._id},process.env.SECRET_KEY,{expiresIn:'10m'})
verifyEmail(token,email)// send email here
newUser.token= token
await newUser.save()
return res.status(201).json({
    success:true,
    message:'User registered successfully',
    user:newUser
})
    }
    catch(e){
res.status(500).json({
    success:false,
    message:e.message
})
    }
}

export const verify= async(req,res)=>{
    try{
        const authHeader= req.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer")){
            res.status(400).json({
                success:false,
                message:'Authorization token is missing or invalid'
            })
        }
        const token = authHeader.split(" ")[1]// [Bearer ,fch98iuhg9jhg8]
let decoded 
try{
    decoded= jwt.verify(token, process.env.SECRET_KEY)
}
catch(e){
    if(e.name=== "TokenExpiredError"){
        return res.status(400).json({
            success:false,
            message:"the registration token has expired"
        })
    }
    return res.status(400).json({
        success:false,
        message:"Token verification failed"
    })
}
const user= await User.findById(decoded.id)
if(!user){
    return res.status(400).json({
        success:false,
        message:'user not found'
    })
}
user.token=null
user.isVerified= true
await user.save()
return res.status(200).json({
    success:true,
    message:"Email verified successfully"
})
    }
    catch(e){
res.status(500).json({
    success:false,
    message:e.message
})
    }
}

export const reVerify= async(req,res)=>{
    try{
        const{email}=req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'10m'})
        verifyEmail(token,email)
        user.token=token
        await user.save()
        return res.status(200).json({
            success:true,
            message:"Verification email sent again successfully",
            token:user.token
        })
    }
    catch(e){
return res.status(500).json({
    success:false,
    message: e.message
})
    }
}


export const login = async(req,res)=>{
    try{
const {email,password}= req.body;
if(!email || !password){
    return res.status(400).json({
        success:false,
        message:"All fields are required "
    })
}
const existingUser= await User.findOne({email})
if(!existingUser){
    return res.status(400).json({
        success:false,
        message:"User not exists"
    })
}
const isPasswordValid = await bcrypt.compare(password,existingUser.password)
if(!isPasswordValid){
    return res.status(400).json({
        success:false,
        message:'Invalid Credentials'
    })
}
if(existingUser.isVerified=== false){
    return res.status(400).json({
        success:false,
        message:"Verify your account then login"
    })
}
//generate token 
const accessToken = jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'10d'})
const refreshToken = jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'30d'})
existingUser.isLoggedIn= true
await existingUser.save()    




const existingSession = await Session.findOne({userId:existingUser._id})
if(existingSession){
    await Session.deleteOne({userId:existingUser._id})
}


await Session.create({userId:existingUser._id})
return res.status(200).json({
    success:true,
    message:`Welcome back ${existingUser.firstName}`,
    user:existingUser,
    accessToken,
    refreshToken
})
}
    catch(e){
        res.status(500).json
({
    success:false,
    message:e.message
})    }
}



export const logout = async(req,res)=>{
    try{
        const userId = req.id
        await Session.deleteMany({userId:userId})
        await User.findByIdAndUpdate(userId,{isLoggedIn:false})
        return res.status(200).json({
            success:true,
            message:'User logged out successfully'
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}