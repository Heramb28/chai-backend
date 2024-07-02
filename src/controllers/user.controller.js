import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {jwt} from "jsonwebtoken"
const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        //reftoken ko db me kaise dale 
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler ( async (req,res) => {
    //  get user details
    //  validation-not empty
    //  check if user already exist-username,email
    //  check for images, check for avatar
    //  upload on cloudinary, avatar
    // create user object - create user in db
    //  remove password and refresh token field from response
    //  check for user creation
    //  return response
    const {fullName, email, username, password} = req.body
    console.log(req.body);
    console.log("email:", email);
    if (
        
            [fullName, email, username, password].some((field)=> field?.trim()==="")
        
    ) {
        throw new ApiError(400,"All field are required")
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        throw new ApiError(400,"Invalid email type")
    }
    
    //checking if user existed or not 
    const existedUser = await User.findOne({
        $or: [{ username } , { email }]
    })

    if (existedUser){
        throw new ApiError (409, "User with email or username already exist")

    }

    console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path//avatar[0] means uski pehli property extract krrhe hai
    //const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath=req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400, " avatar file is required")

    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, " avatar file is required")
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "something went wrong while registring the user")

    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})

const loginUser = asyncHandler( async (req,res) =>{
    //req body -> data
    //username/email check kro
    //find the user
    //password check
    //access and refresh token
    //send cookies and send a response

    const {email, username, fullName, password} = req.body
    if(!username || !email){
        throw new ApiError(400,"username or email is required")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    //User se mongoose ke fn ka access milta hai jaise findbyid etc,
    //user se jo hamne methods banae jaise ispswdcorrect unka access milta hai

    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    //send them to cookies

    //user ko kya kya info bhejni hai
    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    //ham object bnate hai jab cookie bhejte hai
    const options = {
        httpOnly:true,
        secure:true//ye dono step se cookie sirf server se modify hoskti hai frontend se nahi

    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged in successfully"
    )
    )


} )

const logoutUser = asyncHandler(async (req,res) => {
    console.log(req.body)
    //cookie hatado,refresh token ko bhi reset krna hoga
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined//updating it's value
            }
        },
        {
            new:true//return me response milega new wali value milegi
        }
    )

    const options = {
        httpOnly:true,
        secure:true

    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken",options)
    .json( new ApiResponse(200,{},"User logged out"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshingToken = req.cookies
    .refreshToken || req.body.refreshToken
    if(incomingRefreshingToken){
        throw new ApiError(401,"unauthorized requewt")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshingToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"invalid refresh token")
        }
    
        if(incomingRefreshingToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
        const{accessToken, newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}