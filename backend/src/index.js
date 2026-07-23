import express from "express";
import cors from "cors";
import "dotenv/config";
import fs from "fs";
import path from "path";
import connectDB from "./libs/db.js";
import { clerkMiddleware } from '@clerk/express'
import job from "./libs/cron.js";

const app = express();

app.use(cors({
    origin : [process.env.FRONTEND_URL],
    credentials : true
}));

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(clerkMiddleware());

const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(),"public");

app.get("/health",(req,res)=>{
    res.status(200).json({
        message : "OK",
        ok : true
    });
});

if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir));
    app.get("/{*any}",(req,res,next)=>{
        res.sendFile(path.join(publicDir,"index.html"),(err)=>next(err));
    })
}

app.listen(PORT,async()=>{
    await connectDB();
    console.log(`server is up and running on port ${PORT}`);
    if(process.env.NODE_ENV === "production") job.start()
});