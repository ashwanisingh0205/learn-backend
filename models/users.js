import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/user')

const userschema=mongoose.Schema({
  name:String,
  username:String,
  age:Number,
  email:String,
  password:String,
  profilepic:{
    type:String,
    default:'male.jpg'
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'post'
  }
   
  ]
})

const User=mongoose.model('user',userschema)
export default User;