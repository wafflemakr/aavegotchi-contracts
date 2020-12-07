const express = require("express");
const router = express.Router();
const { getAccountInfo } = require("../controllers/account");

// @route   GET api/v1/tokens/project
// @desc    Get All ENS Tokens
// @access  Public
router.get("/:address", getAccountInfo);

module.exports = router;