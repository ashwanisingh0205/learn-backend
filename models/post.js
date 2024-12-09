import mongoose from "mongoose";

const postschema=mongoose.Schema({
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
 },
 date:{
    type:Date,
    default:Date.now
 },
 content:String,
 likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
 }]
})

const postuser=mongoose.model('post',postschema)
export default postuser;