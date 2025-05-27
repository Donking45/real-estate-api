const express = require('express')
const connectDB = require('./db')
const routes = require('./routes')
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

// Routes
app.use('/api', routes);



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})