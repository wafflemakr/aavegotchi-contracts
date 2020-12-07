const express = require('express');
const { ethers } = require("ethers");
require('dotenv').config()

const {DIAMOND_ADDRESS, GHST_TOKEN_ADDRESS} = require("./constants")
const {aavegotchiDiamond, ghstDiamond} = require("./abis")
const provider = new ethers.providers.JsonRpcProvider(process.env.KOVAN_URL);

// Contract Instances
const aaveGotchi = new ethers.Contract(DIAMOND_ADDRESS, aavegotchiDiamond, provider);
const ghst = new ethers.Contract(GHST_TOKEN_ADDRESS, ghstDiamond, provider);

const app = express();

const STATUS = ["Closed Portal", "Open Portal", "Aavegotchi"]

app.get('/:account', async(req,res) => {
  try {
    const {account} = req.params;
    const balance = await ghst.balanceOf(account);
    let gotchis = await aaveGotchi.allAavegotchisOfOwner(account);

    gotchis = gotchis.map(g => {
      return {
        tokenId:g.tokenId.toNumber(),
        name: g.name,
        status:STATUS[g.status],
        collateral:g.collateral,
        stakedAmount:g.stakedAmount.toString()
      }
    })

    res.json({
      account,
      ghstBalance:ethers.utils.formatUnits(balance, 18),
      totalGotchis:gotchis.length,
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
