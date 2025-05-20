const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');


// HTTP Methods (Restful API)

//Get Method
let getUser = async (request,response) =>{
    try{
        const users = await Users.find({})
        response.status(200).json(users)
    }  
    catch (error) {
    console.log(error)
    response.status(500).json({message: "Internal server error", error: error.message});
    }
};

let getUserId =  async (request,response) => {
     try {
        const id = request.params.id
        if(!mongoose.Types.ObjectId.isValid(id)){
            return response.status(400).json({message: "Invalid ID"});
        }
        const user = await Users.findOne({_id:id}) //_id => Obj id
        if(!user)
        {
           return response.status(404).json({message: "user not found"});
        }
        response.status(200).json(user);
    }
     catch (error){
        console.log(error)
    response.status(500).json({message: "Internal server error",error: error.message});
    }
};

// Delete Method
let deleteUser =  async (request,response) => {
     try {
        const id = request.params.id
        if(!mongoose.Types.ObjectId.isValid(id)){
            return response.status(400).json({message: "Invalid ID"});
        }
        const user = await Users.findByIdAndDelete({_id:id}) 
        if(user == null)
        {
           return response.status(404).json({message: "user not found"});
        }
        response.status(200).json(user);
    }
     catch (error) {
        console.log(error)
    response.status(500).json({message: "Internal server error",error: error.message});
    }
};

// Post Method
let createUser =  async (request,response) => {
    try {
    const user = request.body; // Get data from the request (Postman)
    const newUser = new Users(user);
    newUser.validateSync(); // mongoose validation (Data Validation)
    await newUser.save().then(()=>{
       return response.status(201).json({message:"user data created", data:user})
      }).catch((error)=>{
          response.status(400).json({message: error.message});
      })
    
   }catch (error) {
       console.log(error)
   response.status(500).json({message: "Internal server error",error: error.message});
   }
};

// Put Method
const updateUser = async (request, response) => {
    try {
        const id = request.params.id;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid user ID" });
        }

        const updateData = request.body;
       // { new: true } returns the updated document
        const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            return response.status(404).json({ message: "User not found" });
        }

        response.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Error updating user:", error);
        response.status(500).json({ message: "Internal server error", error: error.message });
    }
};




module.exports = {
    getUser,
    getUserId,
    deleteUser,
    createUser,
    updateUser, 
   };