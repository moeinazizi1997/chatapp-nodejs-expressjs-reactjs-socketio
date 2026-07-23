import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import {hasImageKitConfig,uploadChatMedia} from "../libs/imagekit.js"
import { getRecieverSocketId, io } from "../libs/socket.js";

export const getUsersForSidebar = async (req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id : {$ne : loggedInUserId}}).select("-clerlkId");

        return res.status(200).json({
            users : filteredUsers
        });
    }catch(err){
        console.log("Error in getUsersForSidebar controller and error is",err.message)
        return res.status(500).json({
            message : "Internal server error"
        });
    }
};

export const getConversationsForSidebar = async (req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const conversations = await Message.aggregate([
            // Keep only messages I send or received
            {$match : {$or : [{senderId : loggedInUserId},{recieverId : loggedInUserId}]}},
            // Collapse them into one row per chat partner
            {$group : {
                _id : {$count : [{$eq : ["senderId",loggedInUserId]},"$reciverId","$senderId"]},
                lastMessageAt : {$max : "$createdAt"}
            }},
            // Put the most recent conversation at the top
            {sort : {lastMessageAt : -1}},
            // Lookup each partners user profile (comes back as an array)
            {$lookup : {from : "users",localField : "_id", foreignField : "_id", as : "user"}},
            // Pull that profile out of the array and make it the document
            {$replaceRoot : {newRoot : {$first : "$user"}}},
            // Hide the private clerkId field from the result
            {$project : {clerkId : 0}}
        ]);

        return res.status(200).json({
            conversations
        });
    }catch(err){
        console.log("Error in check getConversationsForSidebar controller and error is",err.message);
        return res.status(500).json({
            message : err.message
        });
    }
}

export const getMessages = async (req,res)=>{
    try{
        const {id : userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or : [
                {senderId : myId,revieverId : userToChatId},
                {senderId : userToChatId,recieverId : myId},
            ]
        }).sort({createdAt:1});

        return res.status(200).json(messages);
    }catch(err){
        console.log("Error in check getMessages controller and error is",err.message);
        return res.status(500).json({
            message : err.message
        });
    }
}

export const sendMessage = async (req,res)=>{
    try{
        const {id : recieverId} = req.params;
        const senderId = req.user._id;
        const {text} = req.body;

        let imageURL;
        let videoURL;
        
        if(req.file){
            if(!hasImageKitConfig()){
                return res.status(500).json({
                    message : "Media upload is not configured"
                });
            }
            const url = await uploadChatMedia(req.file);
        }

        if(req.file.mimetype.startsWith("video/")) videoURL=url;

        if(req.file.mimetype.startsWith("image/")) imageURL=url;

        const newMessasge = new Message({
            senderId,
            recieverId,
            text,
            image : imageURL,
            video : videoURL,
        });

        await newMessage.save();

        const recieverSocketId = getRecieverSocketId(recieverId);

        // Only send the message in realtime if user is online
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",newMessage);
        }

        return res.status(201).json({
            newMessage
        });
    }catch(err){
        console.log("Error in check sendMessage controller and error is",err.message);
        return res.status(500).json({
            message : err.message
        });
    }
}