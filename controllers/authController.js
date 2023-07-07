const { faDiagramNext } = require('@fortawesome/free-solid-svg-icons');
const userModel=require('../models/userModel');
const errorResponse = require('../utils/errorResponse');
const errorHandler = require('../middelwares/errorMiddleware');
//jwt token
exports.sendToken=(user,statusCode,res)=>{
  const token=user.getSignedToken(res);
  res.status(statusCode).json({
    success:true,
    token,
  });
};
exports.registerController=async(req,res,next)=>{
  try {
    const {username,email,password}=req.body;
    const existingUser=await userModel.findOne({email});
    if(existingUser){
      return next(new errorResponse('email is already registered',400));
    }
    const user=await userModel.create({username,email,password});
    this.sendToken(user,201,res);
    
  } catch (error) {
    console.log(error);
    next(error)
    
  }
};
exports.loginController=async(req,res,next)=>{
  try {
    const {username,email,password}=req.body;
    if(!email||!password){
      return next(new errorResponse('please provide email and password'))
    }
    const user=await userModel.findOne({email});
    if(!user){
      return next(new errorResponse('invalid credentials',401));
    }
    const isMatch=await user.matchPassword(password);
    if(!isMatch){
      return next(new errorResponse('invalid credential',401))
    }
    this.sendToken(user,200,res);
    
  } catch (error) {
    console.log(error);
    next(error)
    
  }
};
exports.logoutController=async(req,res)=>{
  res.clearCookie('refreshToken')
  return res.status(200).json({
    success:true,
    message:'logout successfully'
  })
};