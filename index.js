const express = require('express')
const mongoose = require("mongoose")
const Item = require("./itemModel")
const connectDB = require('./db');

require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());

// Connect to MongoDB
connectDB();


// Add a found item
app.post("/add-foundItem", async(req, res) =>{
    const {itemName, description, locationFound, dateFound, claimed} = req.body 

    if(!itemName || !locationFound || !dateFound){
      return res.status(400).json({
        message: "Please enter all fields."
      })
    }

    const foundItem = new Item ({
      itemName, description, locationFound, dateFound, claimed
    })

    await  foundItem.save()

    return res.status(200).json({
      message: "Item added Successfully",
      foundItem
    })
})

// View all unclaimed items
app.get("/all-unclaimedItems", async (req, res) => {
    const allItems = await Item.find()
  
    res.status(200).json({
      message: "Successful",
      allItems
    })  
})

// View one item by id
app.get("/one-item/:id", async(req, res) =>{
    const { id } = req.params
  
    const item = await Item.findById(id)
  
    if(!item){
      return res.status(400).json({
        message: "Item not found."
      })
    }
  
    res.status(200).json({
      message: "Successful",
      item
    })
})

// Update an item's details or marked as claimed
app.put("/edit-item/:id", async(req, res) =>{
  const { id } = req.params
  
  const {itemName, description, locationFound, dateFound, claimed} = req.body

  const updatedItem = await Item.findByIdAndUpdate(
   id,
   {itemName, description, locationFound, dateFound, claimed},
   {new: true}
  )
 
  res.status(200).json({
   message: "Successful",
   updatedItem
 })
})


// Delete old/irrelevant entries
app.delete("/delete-item", async(req, res) =>{
  const { id } = req.body

  const deletedItem = await Item.findByIdAndDelete(id)

   res.status(200).json({
    message: "Item deleted Successfully",
    deletedItem
  })
})



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})