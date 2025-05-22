const jwt = require('jsonwebtoken');
const User = require("../models/userModel")
const mongoose = require('mongoose');

/*const authMiddleware = async (req, res, next) => {
    try {
        console.log("Headers received:", req.headers)
        // Check if the Authorization header is present
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            console.log("No authorization header or wrong format")
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        // Extract the token
        const token = req.headers.authorization.split(' ')[1];

        console.log('Verifying token with secret:', process.env.ACCESS_TOKEN);
        console.log('Token:', token)

        // Verify the token
        const payload = jwt.verify(token, `${process.env.ACCESS_TOKEN}`);

        if (!payload.userId || !mongoose.Types.ObjectId.isValid(payload.userId)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Find the user in the database
        const user = await User.findById(payload.userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Set req.user properly
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error)
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;*/


/*
const validateRegister = (req, res, next)=>{


    const { email, password, firstName, lastName, state } = req.body


    const errors = []


    if(!email){
        errors.push("Please add your email")
    }


    if(!password){
        errors.push("Please add your password")
    }


    if(errors.length > 0){
        return res.status(400).json({message: errors})
    }


    next()


}*/


const authMiddleware = async (req, res, next)=>{

    const token = req.header("Authorization")

    if(!token){
        return res.status(401).json({message: "Please login!"})
    }

    const splitToken = token.split(" ")

    const realToken = splitToken[1]

    const decoded = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`)

    if(!decoded){
        return res.status(401).json({message: "Please login!"})
    }

    const user = await User.findById(decoded.id)

    if(!user){
        return res.status(404).json({message: "User account does not exist"})
    }


    if(user?.role !== "agent"){
        return res.status(401).json({message: "Invalid Authorization"})
    }

    req.user = user

    next()
}


module.exports = { authMiddleware };
