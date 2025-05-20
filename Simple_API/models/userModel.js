const mongoose = require('mongoose');

// Mongoose Schema -> for post/put method
const userSchema = new mongoose.Schema({
"id": {type: Number, required: true},
"name": {type: String, required: true},
    "username": {type: String, required: true},
    "email": {type: String, required: true},
    "password": {type: String, required: true},
    "address":{
        "street": {type: String, required: true},
        "suite":  {type: String, required: true},
        "city": {type: String, required: true},
        "zipcode": { type: String, required: true },
        "geo": {
             "lat": {type: Number, required: true},
             "lng":  {type: Number, required: true},
        }
    },
    "phone": {
        type: String,
     required: [true, "Phone number is required"],
         },
    "website":{type: String, required: true},
    "company": {
      "name":{type: String, required: true},
      "catchPhrase": {type: String, required: true},
      "bs": {type: String, required: true},
    }
});

const Users = mongoose.model("users", userSchema)

module.exports = Users;