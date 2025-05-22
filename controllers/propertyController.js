const Property = require('../models/propertyModel')
const SavedProperty = require('../models/savedPropertyModel')
const cloudinary = require('../utils/cloudinary')

const createProperty = async (req, res) => {

  const { title, description, price, location, image } = req.body;

    try{
      const result = await cloudinary.uploader.upload(image, {
        folder: "properties",
        width: 300,
        crop: "scale"
      })
      
  
      if(!title || !price || !location ){
        return res.status(400).json({
          message: "Please enter all fields."
        })
      }
      

      // Only allow if user is an agent
      if (req.user.role !== 'agent') {
        return res.status(403).json({
          message: 'Only agents can list properties'
        })
      }

  
      const newProperty = new Property({
        title,
        description,
        price,
        location,
        agentId: req.user._id,
        image: {
          public_id: result.public_id,
          url: result.secure_url
        }
      })
  
      await newProperty.save()
  
      res.status(201).json({
        message: "Property listed successfully",
        property: newProperty,
      })
    
    } catch (error) {
       console.error("Upload Error:", error)
       res.status(500).json({
        message: 'Failed to list a property',
        error: error.message
       })
    }
}

const getAllProperties = async (req, res) => {
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
        .populate('agentId', 'name email')
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
  
}

const getPropertyById =  async(req, res) => {
  
    try {
      const property = await Property.findById(req.params.id).populate(
        'agentId', 'name email'
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
  
}

const saveProperty = async(req, res) => {
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
}

const getSavedProperties =  async(req, res) => {
    try {
      const saved = await SavedProperty.find({ userId: req.user._id }).populate('propertyId');
  
  
      res.status(200).json({
        count: saved.length,
        properties: saved.map((item) => item.propertyId),
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch saved properties', error: err.message });
    }  
}

module.exports = {
    createProperty,
    getAllProperties,
    getPropertyById,
    saveProperty,
    getSavedProperties,
}