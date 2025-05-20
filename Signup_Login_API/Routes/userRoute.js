const {
    getUsers,
   getUserId,
    deleteUser,
    signupUser,
    loginUser,
    updateUser,
    OTPVerification
   
} = require('../Controllers/userController');
const express = require('express');
const router = express.Router();

const {checkAuth, checkAdmin} = require("../Middleware/auth");
const limiter = require("../Middleware/rateLimit");

// HTTP Methods (Restful API)

// Post method
router.post("/", signupUser);

router.post("/", OTPVerification);

router.post("/login", limiter, loginUser);

// Get Method
router.get("/", checkAuth, checkAdmin, getUsers);

router.get("/:id",checkAuth,checkAdmin, getUserId);

// Put Method
router.put("/:id",checkAuth,checkAdmin, updateUser);

// Delete Method
router.delete("/:id", checkAuth,checkAdmin, deleteUser);


module.exports = router;