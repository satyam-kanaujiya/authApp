import {Router} from "express";
import { deleteUser, loginUser, logoutUser, registerUser } from "../controller/auth.controller.js";
import { varifyJwt,auth,isStudent,isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();



router.route("/registerUser").post(registerUser);

router.route("/login").post(loginUser);

//secured routes when user is already logged in
router.route("/logout").get(varifyJwt,logoutUser);
router.route("/delete").get(varifyJwt,deleteUser);


router.route("/test").get(auth,(req,res)=>{
    res.status(200).send("<h3>This is testing route for authentication<h3>")
});

router.route("/student").get(auth,isStudent,(req,res)=>{
    res.status(200).send("<h3>Welcome Student<h3>"
    )
});

router.route("/admin").get(auth,isAdmin,(req,res)=>{
    res.status(200).send("<h3>Welcome Admin<h3>")
});

export default router;