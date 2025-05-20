const dbconnect = require('./config/dbConnection');
const router = require('./Routes/userRoute');
const morgan = require('morgan');
const cors = require('cors')
const dotenv = require('dotenv');
const express = require('express');
const app = express();


// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
// route middleware
app.use("/users", router);

// call dbconnect
dbconnect();


// Run localhost
dotenv.config();

let port = process.env.PORT || 7000;
let host = process.env.HOST || "127.0.0.1";

app.listen(port, host, () => {
   console.log(`Server is running at http://${host}:${port}`);
});

