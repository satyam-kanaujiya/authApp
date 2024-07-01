import express from "express";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";

const app = express();

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    optionsSuccessStatus:200,
    credentials:true
}));

const template_path = path.join(__dirname,"../template/views")
app.set('view engine','hbs');
app.set('views',template_path);


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import userRoute from "./routes/user.route.js";
app.get("/registerpage",(req,res)=>{
    res.render("index");
});

app.get("/loginpage",(req,res)=>{
    res.render("login");
});

// professional method
app.use("/api/v1/users",userRoute);

export default app;