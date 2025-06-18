const express = require("express");
const router = express.Router();
const { saveProperty, getSavedProperties} = require("../controllers/propertyController");
const  { authorization }  = require("../middleware/authMiddleware");




// Saved property routes
router.post("/saved", authorization, saveProperty); // Protected
router.get("/saved", authorization, getSavedProperties); // Protected


module.exports = router;
