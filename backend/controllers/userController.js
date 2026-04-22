import User from '../models/userModel.js'
import Session from '../models/sessionModel.js'

import 'dotenv/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { verifyEmail } from '../emailverify/verifyEmail.js'
import { sendOTPMail } from '../emailverify/sendOTPMail.js'
import cloudinary from '../utils/cloudinary.js'


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

export const forgotPassword= async(req,res)=>{
    try{
const {email}= req.body;
const user= await User.findOne({email  })
if(!user){
    return res.status(400).json({
        success:false,
        message:"User not found"
    })
}
const otp= Math.floor(100000+Math.random()*900000).toString()
const otpExpiry= new Date(Date.now()+10*60*1000) //10mins
user.otp= otp
user.otpExpiry= otpExpiry
await user.save()
await sendOTPMail(otp,email)

return res.status(200).json({
    success:true,
    message:'otp sent to email successfully'
})

    }
    catch(e){
        return res.status(500).json({
        success:false,
        message:e.message})
        
    }
}


export const verifyOTP= async(req,res)=>{
    try{
const {otp}= req.body;
const email= req.params.email
if(!otp){
    return res.status(400).json({
        success:false,
        message:'Otp is required'
    })
}
const user=await User.findOne({email})
if(!user){
    return res.status(400).json({
        success:false,
        message:"user not found"
    })
}
if(!user.otp || !user.otpExpiry){
    return res.status(400).json({
        sucess:false,
        message:'otp is not generated or already verified'
    })
}
if(user.otpExpiry< new Date()){
    return res.status(400).json({
        success:false,
        message:"otp has expired please request a new one"
    })
}
if(otp !== user.otp){
    return res.status(400).json({
        success:false,
        message:'otp is invalid'
    })
}
user.otp= null
user.otpExpiry= null
await user.save()
return res.status(200).json({
    success:true,
    message:'otp verified successfully'
})
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}

export const changePassword= async(req,res)=>{
    try{
const {newPassword, confirmPassword}= req.body;
const {email}= req.params
const user = await User.findOne({email})
if(!user){
    return res.status(400).json({
        success:false,
        message:"User not found"
    })
}
if(!newPassword || !confirmPassword){
    return res.status(400).json
({
    success:false,
    message:"All fields are required"
})}

if(newPassword!== confirmPassword){
    return res.status(400).json({
        success:false,
        message:"password do not match"
    })
}
const hashedPassword= await bcrypt.hash(newPassword,10)
user.password= hashedPassword
await user.save()
return res.status(200).json({
    success:true,
    message:"password changed successfully"
})

}
    catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}


export const allUser= async(_, res)=>{
    try{
const users= await User.find()
return res.status(200).json({
    success:true,
    users
})
    }
    catch(e){
return res.status(500).json({
    success:false,
    message:e.message
})
    }
}


export const getUserById = async(req,res)=>{
    try{
const {userId}= req.params; //extract userId from request params
const user = await User.findById(userId).select("-password -otp -otpExpiry -token")
if(!user){
    return res.status(404).json({
        success:false,
        message:"User not found"
    })
}
res.status(200).json({
    success:true,
    user,
})
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}


export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id
    const loggedInUser = req.user

    const {
      firstName,
      lastName,
      address,
      city,
      zipcode,
      phoneNo,
      role,
    } = req.body

    // Authorization check
    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      })
    }

    let user = await User.findById(userIdToUpdate)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    let profilePic = user.profilePic
    let profilePicPublicId = user.profilePicPublicId

    // If new image uploaded
    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId)
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        stream.end(req.file.buffer)
      })

      profilePic = uploadResult.secure_url
      profilePicPublicId = uploadResult.public_id
    }

    // Update fields
    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.address = address || user.address
    user.city = city || user.city
    user.zipcode = zipcode || user.zipcode
    user.phoneNo = phoneNo || user.phoneNo
    user.role = role || user.role
    user.profilePic = profilePic
    user.profilePicPublicId = profilePicPublicId

    const updatedUser = await user.save()

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    })
  }
}
