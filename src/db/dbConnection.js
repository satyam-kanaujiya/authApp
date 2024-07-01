import mongoose from "mongoose";
async function DBconnect(){
     try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URI}`);
        console.log(`mongoDB connection successfully.  Host ${connectionInstance.connection.host}`);
     } catch (error) {
        console.log("mongoDB connection failed");
        console.log(error.message);
        process.exit(1);
     }
}

export {DBconnect};