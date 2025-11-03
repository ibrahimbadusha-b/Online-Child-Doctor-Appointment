const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  authEmail: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  childName: { type: String, required: true },
  childAge: {type:String,required:true},
  phone: { type: String, required: true },
  issue: { type: String, required: true },
}, { timestamps: true });

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
