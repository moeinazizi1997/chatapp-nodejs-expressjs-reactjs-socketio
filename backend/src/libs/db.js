import mongoose from 'mongoose';

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Server is connected to mongodb database");
    }catch(err){
        console.log("Server couldn't connect to mongodb database and error is: ",err.message);
        process.exit(1);
    }
}

export default connectDB;