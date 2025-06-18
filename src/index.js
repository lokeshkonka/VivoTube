import { app } from "./app.js";

//Env variable
import  dotenv from "dotenv";
import { connectDB } from "./db/index.js";
dotenv.config()



const PORT = process.env.PORT

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
        
    })
})
.catch((err)=>{
    console.log(`${err} MONGODB CONNECTION ERROR `);
    
})