import mongoose from 'mongoose';

const connectDB= async()=>{
    try{
await mongoose.connect(process.env.MONGO_URI)
console.log('MongoDB connected sucessfully')
    }
    catch(e){
        console.log("MongoDB connection failed:", e)
    }
}
export default connectDB;