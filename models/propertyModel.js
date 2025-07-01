const mongoose = require('mongoose');


const propertySchema = new mongoose.Schema({
  title: { type: String,required: true},
  description: String,
  price: {
    type: Number,
    required: true,
  },
  address:{
    type: String,
    required: [true, 'Please add an address']
  },
  location:{ 
    type:{
      type: String,
      enum: ['Point'],
    },
    coordinates: {
       type: [Number],
       index: '2dsphere',
    },
    formattedAddress: String,
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
