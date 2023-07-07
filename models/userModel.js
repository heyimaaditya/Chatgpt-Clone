const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const JWT=require('jsonwebtoken');
const cookie=require('cookie');
const JWT_ACCESS_EXPIREIN = '15min';
const userSchema=new mongoose.Schema({
  username:{
    type:String,
    required:[true,'username is required']
  },
  email:{
    type:String,
    required:[true,'email is required'],
    unique:true
  },
  password:{
    type:String,
    required:[true,'password is required']
  },
  customerId:{
    type:String,
    default:""
  },
  subscription:{
    type:String,
    default:""
  }
  
});
//hashed password
userSchema.pre('save',async function(next){
  //update password
  if(!this.isModified("password")){
    next();
  }
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt)
});
//match password
userSchema.methods.matchPassword=async function(password){
  return await bcrypt.compare(password,this.password)
};
//sign token
userSchema.methods.getSignedToken=function(res){
  const accessToken=JWT.sign({id:this._id},process.env.JWT_ACCESS_SECRET,{expiresIn:JWT_ACCESS_EXPIREIN})
  const refreshtoken=JWT.sign({id:this._id},process.env.JWT_REFRESH_TOKEN,{expiresIn:process.env.JWT_REFRESH_EXPIREIN});
  res.cookie(refreshtoken,`${refreshtoken}`,{maxAge:86400 * 7000,httpONly:true});
};
const User=mongoose.model('User',userSchema);
module.exports=User
