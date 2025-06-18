import express from 'express'
import cors from 'cors' /// cross origin resourse for database
import cookieParser from 'cookie-parser'
const app =express()
app.use(cors({origin: process.env.CORS_ORIGIN, credentials:true}))


// Common Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public")) //ye browser ko serve karne ke liye hai
app.use(cookieParser())

//Import Routes
import healthcheck from './routes/healthroute.routes.js';
import Userrouter from './routes/user.routes.js'; 
import errorHandler from './middleware/error.middleware.js'


/// Routes
app.use("/api/v1/healthcheck",healthcheck)
app.use("/api/v1/users",Userrouter)
app.use(errorHandler)
export {app}