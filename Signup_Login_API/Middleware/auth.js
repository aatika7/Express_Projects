const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Middleware
// checks wether user is login or not
let checkAuth = (request, response, next) => { 
    try {
        let authHeader = request.headers.authorization;
        
                if (!authHeader || !authHeader.startsWith("Bearer")) {
                    return response.status(401).json({ message: "Unauthorized: No token provided" });
                }
        
                const token = authHeader.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- synchronous verify (or use async with promise)
        
                const id = decoded._id;
                request.id = id;
                const role = decoded.role;
                request.role = decoded.role;
                const email = decoded.email;
                request.email = decoded.email;
                
                console.log(decoded);
                
     // Proceed to the next middleware or route handler
                next();
        } catch (error) {
        console.error(error);
        return response.status(500).json({ message: "Internal server error", error: error.message });
    }
}

 const checkAdmin = (request, response, next) => {
    try {
          // Modify the role to 'user'
          request.role = 'user';
      
          // Log the updated role
          console.log('Role set to:', request.role);
      
          // Proceed to the next middleware or route handler
          next();
        } 
    catch (error) {
          console.error(error);
    return response.status(500).json({message: 'Internal server error',error: error.message});
        }
      };
      

module.exports = {checkAuth, checkAdmin};