const express = require("express");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  saveProperty,
  getSavedProperties,
} = require("../controllers/propertyController");
const  { authorization }  = require("../middleware/authMiddleware");
const upload = require('../middleware/multer')

// Property routes
router.post("/properties", authorization, upload.single('image'), createProperty); // Protected: agent only
router.get("/properties", getAllProperties); // Public
router.get("/properties/:id", getPropertyById); // Public


// Saved property routes
router.post("/saved", authorization, saveProperty); // Protected
router.get("/saved", authorization, getSavedProperties); // Protected


module.exports = router;
