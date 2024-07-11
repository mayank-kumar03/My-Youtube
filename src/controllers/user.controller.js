import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import{User} from "../models/user.model.js"
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
const generateAccessAndRefereshTokens=async(userId)=>
  {
  try{
    const user=await User.findById(userId)
    const accessToken= await user.generateAccessToken()
    const refreshToken=await user.generateRefreshToken()
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}

  }catch(error){
    throw new ApiError(500,"Something went wrong while generating referesh and access token")

  }

}



const registerUser=asyncHandler(async(req,res)=>{
      
      
      //get details from user
      const {fullName,email,username,password}=req.body
      // if(fullName==""){
      //   throw new ApiError(400,"fullname is required")
      // }

      //validation
      if(
        [fullName,email,username,password].some( (field)=>
        field?.trim()=="")
      ){
        throw new ApiError(400,"All fields are required")
      }
      
      //check if user already exist:username or email
     const existedUser= await User.findOne({
        $or:[ {username},{email}]
      })

      if(existedUser){
        throw new ApiError(409,"user name already exists")
      }
      //console.log(req.files);

      //check for images,check for avtar
      const avatarLocalPath=req.files?.avatar[0].path // here multer get path from temp/keep folder file
        //const coverImageLocalPath = req.files?.coverImage[0]?.path;
      let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    
    //upload them in cloudary ,avtar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

   //create object -create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    
    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(//find user id and remmove refresh token and password
        "-password -refreshToken"
    )
    //check our user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

      //return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

      




      })
const loginUser=asyncHandler(async(req,res) =>{
  //req body->data
  const {username,email,password}=req.body;
  if(!(username || email)){
    throw new ApiError(400,"username or password is required");
  }
  //username or password
  //find user 
  const user= await User.findOne({
    $or:[{username},{email}]
  })
  if(!user){
    throw ApiError(404,"User does not exist");
  }
  //password check
  const isPasswordValid=await user.isPasswordCorrect(password)
  if(!isPasswordValid){
    throw ApiError(401,"Invalid user password");
  }
  //access and referesh token
  const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id)

  //send cookies
  const loggedInUser=await User.findById(user._id).select
  ("-password -refreshToken")

  const options={
    httpOnly:true,
    secure:true
  }

  //return response to the user
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user:loggedInUser,accessToken,refreshToken
      },
      "User logged in Successfully"
    )

  )



})
const logoutUser=asyncHandler(async(req,res)=>{
  // for logout our user we have to clear thier cookies and refrestoken
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:1,
      }
    },
    {
      new:true
    }
  )

  const options={
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refereshToken",options)
  .json(new ApiResponse(200,{},"user logged out  successfully"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request")
  }

  try {
      const decodedToken = jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
      )
  
      const user = await User.findById(decodedToken?._id)
  
      if (!user) {
          throw new ApiError(401, "Invalid refresh token")
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used")
          
      }
  
      const options = {
          httpOnly: true,
          secure: true
      }
  
      const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
          new ApiResponse(
              200, 
              {accessToken, refreshToken: newRefreshToken},
              "Access token refreshed"
          )
      )
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})



export {registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken


}