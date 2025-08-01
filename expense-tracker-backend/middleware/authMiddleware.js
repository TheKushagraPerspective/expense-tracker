const jwt = require("jsonwebtoken");
require("dotenv").config();


const authMiddleware = (req , res , next) => {
    // 1. Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    console.log("Incoming Auth Header:", req.headers.authorization);


    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token provided, authorization denied" });
    }

    // 2. Extract the token (remove the "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    try {
        // verify the token
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        
        req.user = decoded;
        console.log("User decoded from token:", decoded); // 🧪 Debug log

        // 5. Move to the next middleware or controller
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token is invalid or expired" });
    }
}


module.exports = authMiddleware;