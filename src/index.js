import app from "./app.js";
import { DBconnect } from "./db/dbConnection.js";
import dotenv from "dotenv";


const PORT = process.env.PORT || 3000
dotenv.config({
    path:"./.env"
})

DBconnect()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server is running at port ${PORT}`);
    });
})
.catch((error)=>{
    console.log("mongodb connection failed!");
    console.log(error.message);
});

 

