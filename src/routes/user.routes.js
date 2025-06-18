import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js"; 
import { registerUser,logoutUser, LoginUser, changeCurrentPassword,getCurrentUser, getUserChannelProfile, updateUserAvatar, updateUserCoverImage, updateAccountDetails, getUserHistory } from "../controller/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";
import { get } from "mongoose";

const Userrouter = Router();

Userrouter.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

Userrouter.route("/login").post(LoginUser);
Userrouter.route("/refreshAccessToken").post(verifyJWT, async (req, res) => {
  try { 
    const user = await User.findById(req.user.id);
    if (!user) {  
      return res.status(404).json({ message: "User not found" });
    }
    const accessToken = user.generateAccessToken();
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
Userrouter.route("/change-password").post(verifyJWT,changeCurrentPassword);
Userrouter.route("/current-User").post(verifyJWT,getCurrentUser);
Userrouter.route("/c/:username").post(verifyJWT,getUserChannelProfile);
Userrouter.route("/update-account").get(verifyJWT,updateAccountDetails);
Userrouter.route("/avatar").post(
  verifyJWT,
  upload.fields([
    { name: "avatar", maxCount: 1 }
  ]),updateUserAvatar
);
Userrouter.route("/coverImage").post(
  verifyJWT,
  upload.fields([
    { name: "coverImage", maxCount: 1 }
  ]),updateUserCoverImage
);
Userrouter.route("/history").post(verifyJWT,getUserHistory);
//Secured routes
Userrouter.route("/logout").post(verifyJWT,logoutUser);





export default Userrouter;
