import express from "express";
import "dotenv/config";
import connectDB from "./libs/db.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT,async()=>{
    await connectDB();
    console.log(`server is up and running on port ${PORT}`);
});