const express = require("express");
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  saveProperty,
  getSavedProperties,
} = require("../controllers/propertyController");
const  { authMiddleware }  = require("../middleware/authMiddleware");
const upload = require('../middleware/multer')

// Property routes
router.post("/properties", authMiddleware, upload.single('image'), createProperty); // Protected: agent only
router.get("/properties", getAllProperties); // Public
router.get("/properties/:id", getPropertyById); // Public


// Saved property routes
router.post("/saved", authMiddleware, saveProperty); // Protected
router.get("/saved", authMiddleware, getSavedProperties); // Protected


module.exports = router;
