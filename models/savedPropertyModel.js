const mongoose = require('mongoose');


const savedPropertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
}, { timestamps: { createdAt: 'savedAt' } });


module.exports = mongoose.model('SavedProperty', savedPropertySchema);
