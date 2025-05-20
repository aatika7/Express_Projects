const {
    getUser,
    getUserId,
    deleteUser,
    createUser,
    updateUser
} = require('../controller/userController');
const express = require('express');
const router = express.Router();

// HTTP Methods (Restful API)

// Get Method
router.get("/", getUser)

router.get("/:id", getUserId);
// Delete Method
router.delete("/:id", deleteUser);
// Post method
router.post("/", createUser);
// Put Method
router.put("/:id", updateUser);


module.exports = router;