const Users = require("../Models/userModel");
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const dotenv = require("dotenv");

dotenv.config();

// HTTP Methods (Restful API)
// Post (signup) Method
let signupUser =  async (request,response) => {
    try {
    const user = request.body; // Get data from the request (postman)
    const {email, password} = user; // eXtract email and password from user
    const checkEmail = await Users.findOne({email: email});
    if(checkEmail){
    return response.status(400).json({message:"email already exist"});
    }
    // encrypt password
    bcrypt.hash(password, 10, async(err, hash) => {
        if(err){
            return response.status(500).json({message: err.message});
        }
    user.password = hash;

    // new User
    const newUser = new Users(user)
    newUser.validateSync(); // mongoose validation (Data Validation)

    // create OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    newUser.otp = otp;

    // Save new User
    await newUser.save().then(()=>{
        
        // send email from nodemialer
        sendEmail.sendEmail(email, user.firstName, "OTP for Verification", otp);

        return response.status(201).json({message:"User created", data:user})
      }).catch((error)=>{
          response.status(400).json({message: error.message});
      })
    });
   }catch (error) {
       console.log(error)
   response.status(500).json({message: "Internal server error",error: error.message});
   }
};

// Post (OTP) Method
const OTPVerification = async (request, response) => {
    try {
        const { email, otp } = request.body;
        const user = await Users.findOne({ email: email });

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }

        // Check if OTP expired (10 minutes = 600,000 ms)
        const otpExpiryTime = 10 * 60 * 1000; // 10 min in milliseconds
        const currentTime = Date.now();
        if (!user.otpCreatedAt || (currentTime - user.otpCreatedAt.getTime()) > otpExpiryTime) {
            return response.status(400).json({ message: "OTP has expired" });
        }

        // Check if OTP matches with Signup OTP
        if (user.otp !== otp) {
            return response.status(400).json({ message: "Invalid OTP" });
        }

        // Update user status to active & clear OTP fields
        
        user.status = "active";
        user.otp = null;
        user.otpCreatedAt = null;
        await user.save();
      return response.status(200).json({ message: "OTP verified successfully" });
    } 
    catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error" });
    }
};



// Post (login) Method
const loginUser =  async (request, response) => {
    try{
        const {email, password} = request.body;
        // Data validation
        if (!email || !password) {
            return response.status(400).json({message:"Please enter email or password"});
        }
        // Find user by email
        const user = await Users.findOne({ email: email });
       if (!user) {
            return response.status(404).json({ message: "Invalid email" });
        }
    // Checks user status
       if(user.status == "deactive"){
        return response.status(401).json({ message: "User is Inactive" });
        }

// Compare passwords with signupUser (Secure/Encrypt Password)  
 bcrypt.compare(password, user.password, async(err, isMatch)=>{
  if(err){
        return response.status(500).json({message:err.message});
    }
  if(isMatch){
        // Create JWT token
        const payload = {
                _id: user._id,
                email: user.email,
                role: user.role,
            };
            const timeOptions = { expiresIn: "1h" };
            const token = jwt.sign(payload, process.env.JWT_SECRET, timeOptions);

   // Send login confirmation email
   sendEmail(user.email, user.firstName, "You've successfully logged in. Welcome!");
       
    return response.status(200).json({message: "Login Success",
         data:{token:token,
             user: {
            firstName: user.firstName,
            lasttName: user.lastName,
            email: user.email,
            phone: user.phone,
            adress: user.adress,
             }
            } // data part
            }); // status part
        } // if(isMatch) part
        else{
            return response.status(400).json({message:"Invalid password"}); 
        }
        });
    }catch(error){
        response.status(500).json({message: "Internal server error", 
            error: error.message}); 
    }
};

// Put Method
const updateUser = async (request, response) => {
    try {
       const id = request.params.id;
       // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ message: "Invalid user ID" });
        }

        const updateData = request.body;

        const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            return response.status(404).json({ message: "User not found" });
        }

    response.status(200).json({message: "User updated successfully",data: updatedUser});

    } catch (error) {
        console.error("Error updating user:", error);
        return response.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//Get Method
// After logging in, we'll get the users.
let getUsers = async (request,response) =>{
    try{
        const users = await Users.find({})
        response.status(200).json(users)
    }  
    catch (error) {
    console.log(error)
    response.status(500).json({message: "Internal server error", error: error.message});
    }
};

// Get Method
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



module.exports = {
    getUsers,
    getUserId,
   signupUser,
    loginUser,
    updateUser,
    deleteUser,
   OTPVerification
   };

