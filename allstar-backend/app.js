const express = require('express');
const app = express();
const userRoutes = express.Router();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const User = require('./models/User')
const Document = require('./models/Document')
const cors = require('cors');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportConfig = require('./passport');

const MongoClient = require('mongodb').MongoClient;

app.use(cookieParser());
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/users',{useNewUrlParser : true,useUnifiedTopology: true, useFindAndModify: false},()=>{
  console.log('successfully connected to database');
});

const userRouter = require('./routes/User');
app.use('/user',userRouter);

// gets all users
userRoutes.route('/').get(function(req, res) {
  console.log("users hit");
  User.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

// creates a new document to push in the user documents array
userRoutes.route('/add').post(async function(req, res) {
  let startTime = new Date(new Date(req.body.documents.start_time) - req.body.documents.time_worked - 1000)
  req.body.documents.start_time = startTime
  let finishTime = new Date(req.body.documents.finish_time)
  req.body.documents.finish_time = finishTime

  const {
    _id,
    documents: {
      start_time,
      note,
      finish_time,
      time_worked
    }
  } = req.body

  const doc = new Document({
    _id: mongoose.Types.ObjectId(),
    start_time,
    note,
    finish_time,
    time_worked,
    user: _id
  })

  const savedDoc = await doc.save()
  const user = await User.findById(_id)
  user.docs.push(savedDoc)
  const savedUser = await user.save()
  res.json({savedDoc, savedUser})

});

// finds the correct document and overwarites the same document in the user table
userRoutes.route('/documents/:id/edit').patch(async function(req, res) {
  let startTime = new Date(new Date(req.body.documents.start_time) - req.body.documents.time_worked - 1000)
  req.body.documents.start_time = startTime
  let finishTime = new Date(req.body.documents.finish_time)
  req.body.documents.finish_time = finishTime

  const {
    _id,
    doc_id,
    documents: {
      start_time,
      note,
      finish_time,
      time_worked
    }
  } = req.body

  const doc = await Document.findById(doc_id)
  const userID = _id
  let user = await User.findById(userID)
  const docIndex = await user.docs.findIndex(d => JSON.stringify(doc._id) === JSON.stringify(d._id))

  const editedDoc = {
    _id: doc_id,
    start_time,
    note,
    finish_time,
    time_worked,
    user: _id
  }

  user.docs.splice(docIndex, 1, editedDoc)
  console.log("overwrite", user.docs[docIndex]);
  user.save()
  res.json(user)
});

// handles auto login for a user after the page is refreshed
userRoutes.post('/auto_login',passport.authenticate('jwt',{session : false}), async (req,res)=>{
  const user = await User.find({username: req.body.username})
  console.log("user:", user);
  res.status(200).json({isAuthenticated : true, user : user});
});

app.use('/users', userRoutes);

app.listen(5000,()=>{
  console.log('express server started');
});
