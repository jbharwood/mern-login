const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');
const Document = require('../models/Document');

// signs the jwt token and expires in 24h
const signToken = userID =>{
  return JWT.sign({
      iss : "joseph",
      sub : userID
  },"joseph",{expiresIn : "24h"});
}

// registers the user
userRouter.post('/register',(req,res)=>{
  const { username,password,role } = req.body;
  User.findOne({username},(err,user)=>{
    if(err)
      res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
    if(user)
      res.status(400).json({message : {msgBody : "Username is already taken", msgError: true}});
    else{
      const newUser = new User({username,password,role});
      newUser.save(err=>{
        if(err)
          res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
        else
          res.status(201).json({message : {msgBody : "Account successfully created", msgError: false}});
      });
    }
  });
});

//logs the user in
userRouter.post('/login',passport.authenticate('local',{session : false}),(req,res)=>{
  if(req.isAuthenticated()){
    const {_id,username,role} = req.user;
    const token = signToken(_id);
    res.cookie('access_token',token,{httpOnly: true, sameSite:true});
    res.status(200).json({isAuthenticated : true,user : {username,role,_id}, token: token});
  }
});

// logs the user out
userRouter.get('/logout',passport.authenticate('jwt',{session : false}),(req,res)=>{
  res.clearCookie('access_token');
  res.json({user:{username : "", role : ""},success : true});
});

// return the user and token
userRouter.get('/profile', (req, res, next) => {
  res.json({
    message : 'You made it to the secure route',
    user : req.user,
    token : req.query.secret_token
  })
});

// gets all documents
userRouter.get('/documents/all',passport.authenticate('jwt',{session : false}),(req,res)=>{
  Document.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

// get docunments by id
userRouter.get('/documents/all/:id',passport.authenticate('jwt',{session : false}),(req,res)=>{
  Document.findById({_id : req.params.id}).populate('documents').exec((err,document)=>{
    if(err)
        res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
    else{
        res.status(200).json({documents : document, authenticated : true});
    }
  });
});

// deletes documents by id
userRouter.delete('/documents/:id/delete',passport.authenticate('jwt',{session : false}), async (req,res)=>{
  const id = req.params.id;
  const doc = await Document.findById(id)
  const userID = doc.user[0]
  let user = await User.findById(userID)
  const docIndex = await user.docs.findIndex(d => JSON.stringify(doc._id) === JSON.stringify(d._id))

  user.docs.splice(docIndex, 1)
  user.save()

  Document.findById({_id: id}).deleteOne().exec(function(err, document) {
    if(err)
        res.status(500).json({message : {msgBody : "Error has occured", msgError: true}});
    else{
        res.status(200).json("Document successfully deleted");
    }
  })

});

// checks for the admin
userRouter.get('/admin',passport.authenticate('jwt',{session : false}),(req,res)=>{
  if(req.user.role === 'admin'){
    res.status(200).json({message : {msgBody : 'You are an admin', msgError : false}});
  }
  else
    res.status(403).json({message : {msgBody : "You're not an admin,go away", msgError : true}});
});

// authenticates the user
userRouter.get('/authenticated',passport.authenticate('jwt',{session : false}),(req,res)=>{
  console.log("authenticated hit");
  const {username,role} = req.user;
  res.status(200).json({isAuthenticated : true, user : {username,role}});
});


module.exports = userRouter;
