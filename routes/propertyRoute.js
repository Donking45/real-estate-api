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
router.post("/agent", authMiddleware, upload.single('image'), createProperty); // Protected: agent only
router.get("/", getAllProperties); // Public
router.get("/:id", getPropertyById); // Public


// Saved property routes
router.post("/saved", authMiddleware, saveProperty); // Protected
router.get("/saved/all", authMiddleware, getSavedProperties); // Protected


module.exports = router;
