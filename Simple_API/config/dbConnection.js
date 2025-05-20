const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


// connenct mongodb compass or mongodb atlas 
let dbconnect = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
            console.log("Database connected");
        })
        .catch((error) => {
            console.error("Database connection failed:", error.message);
        });
};

module.exports = dbconnect;