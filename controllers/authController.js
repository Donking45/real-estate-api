const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
    try {
      const { name, email, password, phoneNumber, role } = req.body
    
      if (!email){
        return res.status(400).json({
          message: "Please add your email"
        })
      }
    
      if (!password){
        return res.status(400).json({
          message: "Please add your password"
        })
      }
    
      const existingUser = await User.findOne({ email })
    
      if(existingUser){
        return res.status(400).json({
          message: "User account already exist"
        })
      }
    
      if (password.length < 6){
        return res.status(400).json({
          message: "Password should be minimum of 6 chars"
        })
      }
      
      const hashedPassword = await bcrypt.hash(password, 12)
    
      const newUser = new User({ 
        name,
        email, 
        password: hashedPassword, 
        phoneNumber,
        role: role || 'user'
        
      })
    
      await newUser.save()
    
      
      res.status(201).json({
        message: "User account created successfully",
        newUser: { name, email, password, phoneNumber, role}
      })
    
    } catch (error) {
        res.status(500).json({
          message: error.message
        })
    }
}

const login =  async (req, res) => {
    
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    
       if(!user){
        return res.status(404).json({
          message: "User account does not exist."
        })
       }
    
    const isMatch = await bcrypt.compare(password, user?.password)
    
       if(!isMatch){
        return res.status(400).json({
          message: "Incorrect email or password."
        })
       }
    
       // Generate a token
    const accessToken = jwt.sign(
        {id: user?._id, role: user.role},
        process.env.ACCESS_TOKEN,
        {expiresIn: "5h"}
    )
       
    const refreshToken = jwt.sign(
        {id: user?._id, role: user.role},
        process.env.REFRESH_TOKEN,
        {expiresIn: "14d"}
    )
    
    res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          email: user?.email,
          name: user?.name,
          password: user?.password,
          phoneNumber: user?.phoneNumber,
          role: user.role
        }
    })
}
    
const forgotPassword = async (req, res) => {
    const {email, userName } = req.body
    
    const user = await User.findOne({ email })
    
      if(!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }
    
      // Send the user an email with their token
    
      const accessToken = await jwt.sign(
        {user},
        `${process.env.ACCESS_TOKEN}`,
        { expiresIn: "5h"}
      )
    
    await sendForgotPasswordEmail(email, accessToken)
    
    res.status(200).json({ message: "Please check your email"})
}
    
const resetPassword =  async (req,res) =>{
    
    const {email, password } = req.body
    
    const user = await User.findOne ( { email })
    
    if(!user){
        return res.status(404).json({ message: "User account not found!"})
    }
    
    const hashedPassword = await bcrypt.hash(password, 12)
    
    user.password = hashedPassword
    
    await user.save()
    
    res.status(200).json({ message: "Password created successful."})
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
}
    