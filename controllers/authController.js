const bcrypt = require('bcryptjs');
const { sendEmail, validEmail } = require('../sendMail')
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

    if (!validEmail(email)){
      return res.status(400).json({
        message: "Incorrect email format"
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
    
  
    const newUser = new User({ 
      name,
      email, 
      password, 
      phoneNumber,
      role: role || 'agent'
      
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
  try{
    const { email, password } = req.body
     
    if(!email || !password) {
      return res.status(400).json({
        message:'Email and password are required'
      })
    }

    const user = await User.findOne({ email:req.body.email.toLowerCase() }).select('+password');
    
       if(!user || !user.password){
        return res.status(404).json({
          message: "User account does not exist."
        })
       }
       console.log("Entered password:", password);
       console.log("Stored hash:", user.password)

       console.log('User verification status:', user.isVerified)

       if(!user.isVerified) {
        //Generate and send OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false});

        await sendEmail({
          email: user.email,
          subject:'Email Verification OTP',
          message: `Your OTP for email verification is: ${otp}`,
        })
        return res.status(401).json({
          message: 'Your email is not verified. An OTP has been sent to your email'
        });
       }

       if(!user) {
        return res.status(403).json({
          message: 'Access denied. Not a user'
        })
       }
    
       const isMatch = await bcrypt.compare(password, user.password)
    
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
          id: user?._id,
          name: user?.name,
          email: user?.email,
          role: user.role
        }
    })
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({
      message:"Server error during login",
      error: error.message,
    });
  }   
};



const forgotPassword = async (req, res, next) => {

  try{
    const { email } = req.body

    if(!email) {
      res.status(400).json({
        message: 'Email is required'
      })
    }

    const user = await User.findOne({email:email.toLowerCase()})

    if(!user){
       return next(new ErrorResponse('User not found',404))
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000
    //admin.otpVerifiedForReset = false;


    await user.save({validateBeforeSave: false})

    console.log("OTP:", otp)
    console.log("Email will be sent to:", email)

    const message = `Your OTP for password reset is:${otp}`;
  
    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP',
      message: message
    })

    res.status(200).json({ message: "Please check your email"})
  
  } catch(err){
    console.error('Forgot Password error:', err)

    return next(new ErrorResponse('There was an error sending otp. Please try again later', 500));
  }

}

const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if(!email || !otp){
      return res.status(400).json({
        message: 'Email and otp are required.'
      })
    }

    const user = await User.findOne({ email });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }


    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }


    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();


    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error('Email verification error:', error);
    return  res.status(500).json({
      message: 'Server error during email verification.'
    })
  }
};


const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if(!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required'
      })
    }


    const user = await User.findOne({ email:email.toLowerCase()});


    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }


    // Check if OTP is invalid or expired
    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }


    // If user not verified yet → this is email verification
    if (!user.isOtpVerified) {
      user.isOtpVerified = true;
    }


    // Whether for email verification or password reset, clear OTP after success
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;
    await user.save();



    return res.status(200).json({ message: 'OTP verified successfully' });


  } catch (error) {
    console.error('verifyOTP error:', error);
    return next(error);
  }
};



const resetPassword = async (req, res, next) => {
  try{
    const {email, newPassword, confirmPassword } = req.body
    

  if(!email || !newPassword || !confirmPassword){
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (newPassword !== confirmPassword){
    return res.status(400).json({
      message: 'Passwords do not match'
    })
  }
  

  const user = await User.findOne({email:email.toLowerCase()})

  if (!user){
    return res.status(404).json({
      message:'User not found'
    })
  }

  if(!user.isOtpVerified) {
    return res.status(400).json({ message:"Please verify OTP before resetting password"})
  }

  
  user.password = newPassword;
  user.isOtpVerified = false
  user.isVerified = true
  await user.save();

  
  return res.status(200).json({
    status: 'Password reset successful'
  })

   } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message:"Server error during password reset",
      error: error.message,
    });
  }   
}
  
  

module.exports = {
  register,
  login,
  forgotPassword,
  verifyEmail,
  verifyOTP,
  resetPassword,
}
    
