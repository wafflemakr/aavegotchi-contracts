const { ethers } = require("ethers");
const { aaveGotchi } = require("../utils")

// @route   GET api/stats
// @desc    Get Global Stats
// @access  Public
exports.getGlobalStats = async(req, res, next) => {
	try {
		let topic = ethers.utils.id("Transfer(address,address,uint256)");

		let filter = {
			address: aaveGotchi.address,
			fromBlock: 21889667,
			toBlock: 'latest',
			topics: [ topic,[ethers.constants.HashZero] ]
		}

		let mints = await aaveGotchi.queryFilter(filter);

		mints = mints.map(m => {
			return {
				tokenId:m.args[2].toNumber(),
				user:m.args[1]
			}
		})

		res.json({
			totalMinted:mints.length,
			data:mints
		})
	} catch (error) {
		console.log(error.message)
		next(error)
	}
}