const { ethers } = require("ethers");
const { aaveGotchi, ghst } = require("../utils")
const { STATUS } = require("../utils/constants")

exports.getAccountInfo = async(req, res, next) => {
	try {
		const {address} = req.params;
		const balance = await ghst.balanceOf(address);
		let gotchis = await aaveGotchi.allAavegotchisOfOwner(address);

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
			address,
			ghstBalance:ethers.utils.formatUnits(balance, 18),
			totalGotchis:gotchis.length,
			gotchis
		})
	} catch (error) {
		console.log(error.message)
		next(error)
	}
}