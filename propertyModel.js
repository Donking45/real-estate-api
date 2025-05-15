const mongoose = require('mongoose');


const propertySchema = new mongoose.Schema({
  title: { type: String,required: true},
  description: String,
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL to image, or make it [String] if multiple
    required: true,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });


module.exports = mongoose.model('Property', propertySchema);
