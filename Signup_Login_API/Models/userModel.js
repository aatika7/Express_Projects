const mongoose = require('mongoose');

// Mongoose Schema -> Define a schema for storing data in MongoDB -> for post/put/delete
const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lasttName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
   role: {type: String, default: "user"},
   phone: String,
   adress: String,
   status: {type: String, default: "deactive"},
   rating: Object,
   createdAt: {type: Date, default: Date.now},
   updatedAt: {type: Date, default: Date.now},
   otp: String,
   otpCreatedAt: Date,
emailSubscription: {type: Boolean, default: false},
 });
 
 const Users = mongoose.model("users", userSchema);


 module.exports = Users;