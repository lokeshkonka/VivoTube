import jwt from 'jsonwebtoken'
import {User} from "../models/user.model.js"
import { Apierror } from "../utils/apierror.js";
import {asynchandle} from "../utils/asynchandler.js"


export const verifyJWT = asynchandle(async (req,_,next)=>{
    const token= req.cookies.accessToken || req.header("Authorization")?.replace("Bearer","")

    if (!token) {
         throw new Apierror(500, "Something went wrong while ,auth token");
    }
    try {
      const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)  
      const user = await User.findById(decodedtoken?._id).select("-password -refreshToken")
      if (!user) {
         throw new Apierror(500, "Unauthorized");
      }
      req.User =user // flow control of middleware to controller
      next() // transfer the conttrol to anotherone .. mmiddlewares
    } catch (error) {
         throw new Apierror(500, "Invalid user access token in middleware");
    }
})

export const verifyAdmin = asynchandle(async (req,_,next)=>{
    const user = req.User
    if (!user || user.role !== "admin") {
        throw new Apierror(403, "Access denied. Admins only.");
    }
    next()
})






