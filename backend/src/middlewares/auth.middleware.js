import {getAuth} from "@clerk/express";
import User from "../models/user.model.js";

export const protectRoute = async (req,res)=>{
    try{
        const {userId} = getAuth(req);

        if(!userId){
            return res.status(401).json({
                message : "Unauthorized"
            });
        }

        const user = await User.findOne({clerkId : userId});

        if(!user){
            return res.status(404).json({
                message : "User profile is not synced yet"
            });
        }

        req.user = user;
        next()
    }catch(err){
        console.log("Error in middleware protectRoute and Error is:",err.message);
        return res.status(500).json({
            message : "Internal server error"
        });
    }
}