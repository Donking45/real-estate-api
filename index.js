const express = require('express')
const mongoose = require("mongoose")
const Property = require("./propertyModel")
const SavedProperty = require("./savedPropertyModel")
const User = require("./userModel")
const connectDB = require('./db')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());

// Connect to MongoDB
connectDB();



app.post("/auth/register", async (req, res) => {
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
})

app.post("/auth/login", async (req, res) => {

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
       {id: user?._id},
       process.env.ACCESS_TOKEN,
       {expiresIn: "5m"}
   )
   
   const refreshToken = jwt.sign(
    {id: user?._id},
    process.env.REFRESH_TOKEN,
    {expiresIn: "14d"}
   )

   res.status(200).json({
    message: "Login successful",
    accessTOKEN,
    user: {
      email: user?.email,
      name: user?.name,
      password: user?.password,
      phoneNumber: user?.phoneNumber,
      role: user.role
    }
   })
})

app.post("/properties/agent", async (req, res) => {
  try{
    const { title, description, price, location, image } = req.body

    if(!title || !price || !location ){
      return res.status(400).json({
        message: "Please enter all fields."
      })
    }


    const newProperty = new Property({
      title,
      description,
      price,
      location,
      image,
      agentId: req.user._id,
    })

    await newProperty.save()

    res.status(201).json({
      message: "Property listed successfully",
      property: newProperty,
    })
  
  } catch (error) {
     res.status(500).json({
      message: 'Failed to list a property',
      error: error.message
     })
  }
})

app.get("/properties", async (req, res) => {
  try {
    const { location, keyword, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const filter = {};


    // Filters
    if (location) filter.location = new RegExp(location, 'i');
    if (keyword) filter.title = new RegExp(keyword, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }


    // Pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .populate('agentId', 'name' , 'email')
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      properties,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching properties', error: err.message });
  }

})


// View properties by id
app.get("/properties/:id", async(req, res) => {
  
  try {
    const property = await Property.findById(req.params.id).populate(
      'agentId', 'name' , 'email'
    );


    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (err) {
    res.status(500).json(
      { 
      message: 'Error fetching property',
       error: err.message 
    });
  }

})

app.post("/saved", async(req, res) => {
  try {
    const { propertyId } = req.body;


    const alreadySaved = await SavedProperty.findOne({
      userId: req.user._id,
      propertyId,
    });


    if (alreadySaved) {
      return res.status(400).json({ message: 'Property already saved' });
    }


    const saved = new SavedProperty({
      userId: req.user._id,
      propertyId,
    });


    await saved.save();


    res.status(201).json({
       message: 'Property saved',
        saved });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to save property',
       error: err.message 
      });
  }

})
  
app.get("/saved", async(req, res) => {
  try {
    const saved = await SavedProperty.find({ userId: req.user._id }).populate('propertyId');


    res.status(200).json({
      count: saved.length,
      properties: saved.map((item) => item.propertyId),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch saved properties', error: err.message });
  }

})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})