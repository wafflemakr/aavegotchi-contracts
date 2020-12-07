const { ethers } = require("ethers");

const {DIAMOND_ADDRESS, GHST_TOKEN_ADDRESS} = require("./constants")
const {aavegotchiDiamond, ghstDiamond} = require("./abis")
const provider = new ethers.providers.JsonRpcProvider(process.env.KOVAN_URL);

// Contract Instances
exports.aaveGotchi = new ethers.Contract(DIAMOND_ADDRESS, aavegotchiDiamond, provider);
exports.ghst = new ethers.Contract(GHST_TOKEN_ADDRESS, ghstDiamond, provider);
exports.provider = provider;