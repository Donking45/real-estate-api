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
   public_id: {
       type: String,
       required: true
   },
   url: {
    type: String,
    required: true
   }
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });


module.exports = mongoose.model('Property', propertySchema);
