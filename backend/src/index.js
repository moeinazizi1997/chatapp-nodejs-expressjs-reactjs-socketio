import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./libs/db.js";
import { clerkMiddleware } from '@clerk/express'

const app = express();

app.use(cors({
    origin : [process.env.FRONTEND_URL],
    credentials : true
}));

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(clerkMiddleware());

app.get("/health",(req,res)=>{
    res.status(200).json({
        message : "OK",
        ok : true
    });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,async()=>{
    await connectDB();
    console.log(`server is up and running on port ${PORT}`);
});