const express = require("express");
const router = express.Router();
const { getAccountInfo } = require("../controllers/account");

// @route   GET api/account/:address
// @desc    Get Account Info
// @access  Public
router.get("/:address", getAccountInfo);

module.exports = router;