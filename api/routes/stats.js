const express = require("express");
const router = express.Router();
const { getGlobalStats } = require("../controllers/stats");

// @route   GET api/stats
// @desc    Get Global Stats
// @access  Public
router.get("/", getGlobalStats);

module.exports = router;