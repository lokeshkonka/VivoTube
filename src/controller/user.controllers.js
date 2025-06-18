import { User } from "../models/user.model.js";
import { Apierror } from "../utils/apierror.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { apiresponse } from "../utils/apirespnse.js";
import { asynchandle } from "../utils/asynchandler.js"; // You missed this import
import jwt from "jsonwebtoken";
const registerUser = asynchandle(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // Validate input fields
  if ([fullname, email, username, password].some(field => !field?.trim())) {
    throw new Apierror(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new Apierror(409, "User with email or username already exists");
  }

  // Get file paths
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new Apierror(400, "Avatar file is missing HAI");
  }

  // Upload files to Cloudinary
  // const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  // let coverImageUpload = null;
  // if (coverImageLocalPath) {
  //   coverImageUpload = await uploadOnCloudinary(coverImageLocalPath);
  // }
  // For Avatar image to cloudinary
  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar uploaded successfully:", avatar);
    
  } catch (error) {
  console.log("Error uploading files to Cloudinary: in avatar", error);
    throw new Apierror(500, "Error uploading avatar to Cloudinary");
  }
  //For Cover Image
  let coverImageUpload;
  try {
    coverImageUpload = await uploadOnCloudinary(coverImageLocalPath);
    console.log("Cover image uploaded successfully:", coverImageUpload);
  } catch (error) {
    console.log("Error uploading files to Cloudinary: in cover image", error);
    throw new Apierror(500, "Error uploading cover image to Cloudinary");
  }

  // Create user
  const newUser = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImageUpload?.url || "",
    email,
    username: username.toLowerCase(),
    password
  });

  // Fetch user details without password
  const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new Apierror(500, "Something went wrong while creating user");
  }

  return res.status(201).json(
    new apiresponse(201, createdUser, "User registered successfully")
  );
});
const generateAccess_RefreshToken =  async (userId)=>{
  try {
    const user = await User.findById(userId)
    const accessToken = await User.generateAccessToken
    const refreshToken =await User.generateRefreshToken
    user.refreshToken = refreshToken
  } catch (error) {
    throw new Apierror(500,"CANNOT ACCESS OR REFRESH TOKEN")
  }
}

const LoginUser =asynchandle(async (req,res)=>{
//get data from body
const {email,username,password} = req.body

//validation
if(!email){
  throw new Apierror(400,"email ka lafda hai");

}
const user = await User.findOne({
  $or:[{username},{email}]
})

if(!user){
   throw new Apierror(400,"User not found");
}
// validate password
const isPassword = await user.isPasswordCorrect(password)
if (!isPassword) {
  throw new Apierror(401,"Invalid Password");
  
}
const {accessToken,refreshToken}= await generateAccess_RefreshToken(user._id)

//fail safe query
const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
if(!loggedInUser){
  throw new Apierror(401,"Something went wrong ,in LoggedIN");
}
const options ={
  httpOnly:true,
  secure:process.env.NODE_ENV === "production",
}
return res.status(200).cookie("accessToken",accessToken,options)
.cookie("RefreshToken",refreshToken)
.json(new apiresponse(200,{user:loggedInUser,accessToken,refreshToken},"User Logged In Successfully buddy!"))
})
const logoutUser =asynchandle(async (req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,{$set:{refreshToken:undefined}},{new:true}
  ) 
  const options ={
    httpOnly:true,
    secure:process.env.NODE_ENV == "production"
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new apiresponse(200,"User Logged out Successfully"))
})
const refreshAccessToken = asynchandle( async (req,res)=>{ 
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
if(!incomingRefreshToken){
  throw new Apierror(401,"Refresh Token Is required!");
}
try {
  const decodedToken = jwt.verify(
   incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
  )
  const user = await User.findById(decodedToken?._id)
  if (!user) {
    throw new Apierror(401,"Invalid RefreshToken");
  }
  if (incomingRefreshToken !== User?.refreshToken) {
    throw new Apierror(401,"Refresh Token Not Matched");
  }
  const options ={
    httpOnly:true,
    secure:process.env.NODE_ENV === "production"
  }
  const {accessToken,refreshToken:NewrefreshToken} = await generateAccess_RefreshToken(user._id);
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("RefreeshToken",NewrefreshToken,options)
  .json(
    new apiresponse(200,{accessToken, refreshToken:NewrefreshToken},"Access Token Successfully")
  )

} catch (error) {
  throw new Apierror(401,"Something went wrong in RefreshToken");
}

})




export const registeredUser = async (req, res, next) => {
  try {
    console.log("📥 Incoming register request");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    // Temporarily test response
    return res.status(200).json({ message: "Register endpoint working!" });
  } catch (err) {
    next(err);
  }
};
const changeCurrentPassword = asynchandle(async (req, res) => {
   const { currentPassword, newPassword } = req.body;
   const user = await User.findById(req.user._id);
   const isMatch = await user.isPasswordCorrect(currentPassword);
  // // Validate input fields
  if (!currentPassword || !newPassword) {
     throw new Apierror(400, "Current and new passwords are required");
   }

  // // Check if user exists
  // const user = await User.findById(req.user._id);
  // if (!user) {
  //   throw new Apierror(404, "User not found");
  // }

  // // Validate current password
  // const isMatch = await user.isPasswordCorrect(currentPassword);
  // if (!isMatch) {
  //   throw new Apierror(401, "Current password is incorrect");
  // }

  // Update password
   user.password = newPassword;
   await user.save({ validateBeforeSave: true });

   return res.status(200).json(new apiresponse(200, null, "Password changed successfully"));
});
const getCurrentUser = asynchandle(async (req, res) => {
  // Fetch user details without password and refreshToken
  // const user = await User.findById(req.user._id).select("-password -refreshToken");
  // if (!user) {  
  //   throw new Apierror(404, "User not found");
  // }   

  // return res.status(200).json(new apiresponse(200, { user }, "User fetched successfully"));
  return res.status(200).json(new apiresponse(200, req.user, "User fetched successfully"));
});
const updateAccountDetails = asynchandle(async (req, res) => {
const { fullname, email, username } = req.body;

  // Validate input fields
  if ([fullname, email, username].some(field => !field?.trim())) {
    throw new Apierror(400, "All fields are required");
  }

  // Check if user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new Apierror(404, "User not found");
  }
  const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: { fullname, email, username: username.toLowerCase() } }, { new: true })
    .select("-password -refreshToken");

  return res.status(200).json(new apiresponse(200, updatedUser, "User details updated successfully"));
});
const updateUserAvatar = asynchandle(async (req, res) => {
  const avatarLocalPath = req.file?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new Apierror(400, "Avatar file is missing");
  }

  // Upload avatar to Cloudinary
   const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUpload.url) {
    throw new Apierror(500, "Error uploading avatar to Cloudinary");
  }

  // Update user avatar
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarUpload.url },
    { new: true }
  ).select("-password -refreshToken");

  // if (!user) {
  //   throw new Apierror(404, "User not found");
  // }

  // return res.status(200).json(new apiresponse(200, user, "Avatar updated successfully"));
});
const updateUserCoverImage = asynchandle(async (req, res) => {
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  if (!coverImageLocalPath) {
    throw new Apierror(400, "Cover image file is missing");
  }

  // // Upload cover image to Cloudinary
  const coverImageUpload = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImageUpload) {
    throw new Apierror(500, "Error uploading cover image to Cloudinary");
  }

  // Update user cover image
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { coverImage: coverImageUpload.url },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new Apierror(404, "User not found");
  }

  return res.status(200).json(new apiresponse(200, user, "Cover image updated successfully"));
});
const getUserChannelProfile = asynchandle(async(req,res)=>{
const { username } = req.params;
  if (!username) {
    throw new Apierror(400, "Username is required");
  }
  const channel = await User.aggregate([ 
    { $match: { username: username.toLowerCase() } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subsrcribedTo"
      }
    },
    {
    $addFields: {
        subscriberCount: { $size: "$subscribers" },
        subscribedToCount: { $size: "$subsrcribedTo" }
      },
      isSubscribed: { $cond: { if: { $gt: [ { $size: "$subscribers" }, 0 ] }, then: true, else: false } }
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        subscriberCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
        email: 1,
      }
    }
  ]);

  if (!channel) {
    throw new Apierror(404, "Channel not found");
  }

})
import mongoose from "mongoose";
const getWatchHistory = asynchandle(async(req,res)=>{
 const user = await User.aggregate([
    { $match: { _id:new mongoose.Types.ObjectId(req.user._id) } },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline:[
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "ownerDetails"
            }
          },
          {
           $addFields: {
              ownerDetails: { $arrayElemAt: ["$ownerDetails", 0] }
            }
          }
        ]
      }
    }
  ]);
  return res.status(200).json(new apiresponse(200, user[0]?.watchHistory || [], "Watch history fetched successfully"));
});


export { registerUser,LoginUser,refreshAccessToken,logoutUser,getCurrentUser,changeCurrentPassword,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile, getWatchHistory as getUserHistory };
