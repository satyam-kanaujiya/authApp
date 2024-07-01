import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
dotenv.config();

const varifyJwt = asyncHandler(async (req,res,next)=>{
    
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") || req.body.token;
   
       if(!token){
           return res.status(401).json({
               message:"token not found"
           })
       }
   
       
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
   
       const user = await User.findById(decodedToken?._id).select(" -password ");
   
       if(!user){
           return  res.status(401).json({
               message:"Invalid token"
           })
       }

       // we are here means user exist and user has right access token means correct user is logged in
   
       // if user exist using that token
       //req is also an object
   
       req.user = user;
       next();
});

const auth = asyncHandler(async (req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") || req.body.token;
       
           if(!token){
               return res.status(401).json({
                   message:"token not found",
                   success:false
               })
           }
           
        try {
            const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            req.decodedToken = decodedToken;
            } catch (error) {
                return res.status(401).json({
                    message:"token couldn't verified",
                    success:false
                })
        }
    
        next();
    } catch (error) {
        return res.status(401).json({
            message:"token couldn't verified",
            success:false
    })
    }

});

const isStudent = asyncHandler(async(req,res,next)=>{
    try {
        if(req.decodedToken.role=="Admin"){
            return res.status(401).json({
                success:false,
                message:"you don't have permission to visit student pannel"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified"
        });
    }
});

const isAdmin = asyncHandler(async(req,res,next)=>{
    try {
        if(req.decodedToken.role=="Student"){
            return res.status(401).json({
                success:false,
                message:"you don't have permission to visit Admin pannel"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified"
        });
    }
});

export {varifyJwt,auth,isStudent,isAdmin}