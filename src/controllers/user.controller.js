import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import{User} from "../models/user.model.js"
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser=asyncHandler(async(req,res)=>{
      //get details from user
      //validation
      //check if user already exist:username or email
      //check for images,check for avtar
      //upload them in cloudary ,avtar
      //create object -create entry in db
      //remove password and refresh token field from response
      //check our user creation
      //return res
      const {fullName,email,username,password}=req.body
      // if(fullName==""){
      //   throw new ApiError(400,"fullname is required")
      // }
      if(
        [fullName,email,username,password].some( (field)=>
        field?.trim()=="")
      ){
        throw new ApiError(400,"All fields are required")
      }

     const existedUser= User.findOne({
        $or:[ {username},{email}]
      })

      if(existedUser){
        throw new ApiError(409,"user name already exists")
      }

      const avatarLocalPath=req.files?.avatar[0].path // here multer get path from temp/keep folder file
        //const coverImageLocalPath = req.files?.coverImage[0]?.path;
      let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(//find user id and remmove refresh token and password
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

      




      })



export {registerUser,}