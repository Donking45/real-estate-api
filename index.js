const express = require('express')
const authRoute = require('./routes/authRoute')
const connectDB = require('./db')
const propertyRoute = require("./routes/propertyRoute")
require('dotenv').config();
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
connectDB();

app.use('/uploads', express.static('uplaods'));


app.use(propertyRoute);

app.use(authRoute)



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})