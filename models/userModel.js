const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  role: { type: String, enum: ['agent', 'user'], required: true},
  phoneNumber: { type: String },
  otp: { type: String },
  otpExpires: {type: Date },
  isVerified: {type: Boolean, default: false },
  isOtpVerified: {type: Boolean, default: false }
  
}, { timestamps: true });

userSchema.virtual('confirmPassword')
  .get(function (){
    return this._confirmPassword
  })
  .set(function (value){
    this._confirmPassword = value
  })


  //Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12)

  next()

});

// password comparison method
userSchema.methods.correctPassword = async function (candidatePassword,
  userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
  };

  
module.exports = mongoose.model('User', userSchema);