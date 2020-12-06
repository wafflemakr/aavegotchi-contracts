const express = require('express');
const { ethers } = require("ethers");
const {DIAMOND_ADDRESS, GHST_TOKEN_ADDRESS} = require("./constants")
require('dotenv').config()

const {abi:aaveGotchiAbi} = require("../artifacts/contracts/Aavegotchi/interfaces/IAavegotchiDiamond.sol/IAavegotchiDiamond.json")
const {abi:ghstAbi} = require("../artifacts/contracts/GHST/interfaces/IGHSTDiamond.sol/IGHSTDiamond.json")

const provider = new ethers.providers.JsonRpcProvider(process.env.KOVAN_URL);

// Contract Instances
const aaveGotchi = new ethers.Contract(DIAMOND_ADDRESS, aaveGotchiAbi, provider);
const ghst = new ethers.Contract(GHST_TOKEN_ADDRESS, ghstAbi, provider);

const app = express();

app.get('/', async(req,res) => {
  try {
    const account = "0xB29aE9a9BF7CA2984a6a09939e49d9Cf46AB0c1d"
    const balance = await ghst.balanceOf(account);
    const gotchis = await aaveGotchi.allAavegotchisOfOwner(account);

    res.json({
      account,
      balance:ethers.utils.formatUnits(balance, 18),
      gotchis
    })
  } catch (error) {
    console.log(error.message)
  }
});

const PORT = process.env.PORT || '3000';

app.listen(PORT, () => {
  console.log(`Server running on port ${ PORT}`)
})
