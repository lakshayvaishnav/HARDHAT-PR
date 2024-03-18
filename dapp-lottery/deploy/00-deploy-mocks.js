const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.parseEther("0.25") //0.25 is premium . it cost 0.25 link per request
const GAS_PRICE_LINK = 1e9
// 10000000 //CALCUALATED value based on the gas price of the chain.

//chainlink nodes pays the gas fees to give us randomnessn & do external execution.
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (chainId == 31337) {
        log("Local network detected ! deploying Mocks...")
        //deploy a mock vrfcoordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        log("Mocks deployed successfully")
        log("________________________________________________________________")
    }
}

module.exports.tags = ["all", "mocks"]
