import { User } from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import fs from "fs";


const registerUser = asyncHandler(async (req,res)=>{

    const {username,password,email,role} = req.body;

    //validate fields
    if([username,password,email,role].some((field)=>{
        return field?.trim()==="";
    })){
        return res.status(400).json({
            message:"please fill all fields",
            success:false
         })
    };

    //check email is correct or not
    if(!email.includes('@'))
    {
        return res.status(400).json({
        message:"enter valid email",
        success:false
        }) 
    };

    //check already register
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    });

    if(existedUser){
        return res.status(400).json({
            message:"user already exists",
            success:false
        }) 
    }

    const profileUrl = ""
    const user = await User.create({
        username,
        email,
        password,
        role,
        profile: profileUrl || ""
    });

    const createdUser = await User.findById(user._id).select("-password ");
    if(!createdUser){
        return  res.status(400).json({
            message:"something went wrong while registering the user",
            success:false
        })
    }

    res.send("<h3>user has registered successfully<h3>");
    
});

const loginUser = asyncHandler(async (req,res)=>{
    const {username,password,email} = req.body;

    
    //validation of username and email
    if(!username || !email ){
        return res.status(400).json({
            success:false,
            message:"invalid username or email"
        });
    }

    //search user
    const searchedUser = await User.findOne({
        $and:[{username},{email}]
    });

    if(!searchedUser){
        return res.status(404).json({
            success:false,
            message:"user not found"
        })
    };

    //check valid password
    const checkPassword = await searchedUser.isPasswordCorrect(password);
    if(!checkPassword){
        return res.status(401).json({
            success:false,
            message:"password is incorrect"
        })
    };

    const options={
        httpOnly:true,
        secure:true
    }
    //generate access token
    const accessToken = await searchedUser.generateAccessToken();

    const sendUser = await User.findById(searchedUser._id).select(" -password ");

 
    const loginHTML = fs.readFileSync('../authApp/src/htmlFiles/login.html','utf-8');

    return res.setHeader('Content-Type',"text/html").cookie("accessToken",accessToken,options).send(loginHTML);
});

const logoutUser = asyncHandler(async(req,res)=>{

    // console.log("printing req.user")
    // console.log(req.user)
    const findUser = await User.findById(req.user._id);
    const options ={
        httpOnly:true,
        secure:true
    }
    const logoutHTML = fs.readFileSync('../authApp/src/htmlFiles/logout.html','utf-8');
    return res.setHeader('Content-Type',"text/html").clearCookie("accessToken",options).send(logoutHTML);
});
    //delete controller
    const deleteUser = asyncHandler(async(req,res)=>{
        const deleteUser = await User.findByIdAndDelete(req.user._id);

        const options ={
            httpOnly:true,
            secure:true
        }

        // for rendering
        const deleteHTML = fs.readFileSync('../authApp/src/htmlFiles/delete.html','utf-8');
        return res.setHeader('Content-Type',"text/html").clearCookie("accessToken",options).send(deleteHTML);


    })
export {registerUser,loginUser,logoutUser,deleteUser};