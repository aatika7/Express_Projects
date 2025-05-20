const dbconnect = require('./config/dbConnection');
const router = require('./routes/userRoute');
const morgan = require('morgan');
const cors = require('cors')
const dotenv = require('dotenv');
const express = require('express');
const app = express();

dotenv.config();

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());



// route
app.use("/users", router);


app.get("/", (request,response)=>{
    response.send("I'm a backend developer")
});


// call dbconnect
dbconnect();



// Run localhost

let port = process.env.PORT || 5000;
let host = process.env.HOST || "128.0.0.1";

app.listen(port, host, () => {
   console.log(`Server is running at http://${host}:${port}`);
});

