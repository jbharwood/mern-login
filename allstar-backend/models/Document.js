const mongoose = require('mongoose');

let DocumentSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
	start_time : { type: Date },
  note : { type: String },
  finish_time : {
    type : Date,
    required : true
  },
  time_worked : {
    type : Number,
    required : true
  },
  user : [{ type : mongoose.Schema.Types.Object, ref : 'Users' }]
});

module.exports = mongoose.model('Document', DocumentSchema);
