import express from 'express'
import jwt from 'jsonwebtoken'
const app=express();
import bcrypt from 'bcrypt'
import User from './models/users.js';
import postuser from './models/post.js';
import cookieParser from 'cookie-parser';
app.set('view engine','ejs')

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
import upload from './config/multer.js';
import crypto from 'crypto'
import multer from 'multer';
import path from 'path';

const Logedin=(req,res,next)=>{
   if(req.cookies.token=='') res.redirect('/login')
      else{
   let data=jwt.verify(req.cookies.token,'shh')
   req.user=data
   next(); 
   }

}

app.get('/',(req,res)=>{
   res.render('index')

})
app.get('/upload/profile',(req,res)=>{
   res.render('test')

})
app.post('/upload',Logedin,upload.single('image'),async(req,res)=>{
  let user=await User.findOne({email:req.user.email})
  user.profilepic=req.file.filename;
  await user.save();
  res.redirect('/profile')


})
app.post('/upload',upload.single("image"),(req,res)=>{
   console.log(req.file)
  res.send('succesfully')

})
app.get('/login',(req,res)=>{
   res.render('login')
})
app.get('/read',async(req,res)=>{
   let user = await User.find()
   res.send(user)
})
app.post('/register',async(req,res)=>{
   let {email,username,name,age,password}=req.body
   let user=await User.findOne({email})
   if(user)return res.status(500).send('ho gya hai phele se')
      bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
         let user = await User.create({
            name,
            username,
            age,
            email,
            password:hash,
            });
            let token=jwt.sign({email:email,userid:user._id},'shh')
            res.cookie('token',token)
            res.redirect('/login')
            

        })
      })

})
app.post('/login',async(req,res)=>{
   let {email,password}=req.body
   let user=await User.findOne({email})
   // if(!user)return res.status(500).send('something went wrong')
    
 bcrypt.compare(password,user.password,(err,result)=>{
//   console.log(result)

if(result){ let token=jwt.sign({email:email,userid:user._id},'shh')
   res.cookie('token',token)


res.status(200).send('yes you login succesfuly')}
  
   else res.redirect('/login')
})

})
app.get('/logout',(req,res)=>{
   res.cookie('token','')
   res.redirect('/login')
})

app.get('/profile',Logedin,async(req,res)=>{
   let user= await User.findOne({email:req.user.email}).populate('posts')
     res.render('profile',{user})
   })

app.post('/post',Logedin,async(req,res)=>{
   let user= await User.findOne({email:req.user.email})
   let{content}=req.body
  let post=await postuser.create({
      user:user._id,
      content

   })
   user.posts.push(post._id)
    await user.save()
    res.redirect('/profile')
   
  })
  app.get('/like/:id',Logedin,async(req,res)=>{
   let post= await postuser.findOne({_id:req.params.id}).populate('user')
   if(post.likes.indexOf(req.user.userid)===-1){
      post.likes.push(req.user.userid)
   }else{
      post.likes.splice(post.likes.indexOf(req.user.userid),1)
   }
   await post.save()
   res.redirect('/profile')
   })
app.get('/edit/:id',Logedin,async(req,res)=>{
   let post= await postuser.findOne({_id:req.params.id})
   
   res.render('edit',{post})
   })
app.post('/update/:id',Logedin,async(req,res)=>{
   let post= await postuser.findOneAndUpdate({_id:req.params.id},{content:req.body.content})
   
   res.redirect('/profile')
   })



app.listen(3000)