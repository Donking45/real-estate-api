const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {type: String, require: true},
    description: {type: String, require: false},
    locationFound: {type: String, require: true},
    dateFound: {type: String, default: true},
    claimed: {type: Boolean, default: false}
}, { timestamps: true } )

const Item = new mongoose.model("Item", itemSchema)

module.exports = Item