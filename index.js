const express = require('express')
const bodyParser = require('body-parser')
const { register, login, forgotPassword, resetPassword } = require("./controllers/authController")
const { createProperty, getAllProperties, getPropertyById,
  saveProperty, getSavedProperties } = require("./controllers/propertyController")
const connectDB = require('./db')
const  {authMiddleware } = require('./middleware/authMiddleware')
const propertyRoute = require("./routes/propertyRoute")
require('dotenv').config();
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
connectDB();

app.use('/uploads', express.static('uplaods'));


app.use('/properties', propertyRoute);




app.post("/auth/register", register)
app.post("/auth/login", login)
app.post("/forgot-password", forgotPassword)
app.patch("/reset-password", authMiddleware, resetPassword)
// app.post("/properties/agent", createProperty)
// app.get("/properties", getAllProperties)
// app.get("/properties/:id", getPropertyById)
// app.post("/saved", saveProperty)
// app.get("/saved", getSavedProperties)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})