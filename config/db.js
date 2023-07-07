const mongoose=require('mongoose');
const colors=require('colors');
const connectDB=async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb databse server ${mongoose.connection.host} connected`.bgGreen);
    
  } catch (error) {
    console.log(`database server ${error} connection error `.bgCyan.bgWhite);
    
  }
};
module.exports=connectDB;