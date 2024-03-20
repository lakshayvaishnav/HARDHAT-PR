const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verfiy } = require("../utils/verify")

const VRF_SUB_FUND_AMOUT = ethers.parseEther("2")
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    const chainId = 31337
    let vrfCoordinatorV2Adress, subscriptionId

    if (chainId == 31337) {
        let contract = await deployments.get("VRFCoordinatorV2Mock")

        const vrfCoordinatorV2Mock = await ethers.getContractAt(
            "VRFCoordinatorV2Mock",
            contract.address,
            signer
        )
        console.log("getcontract : " + contract)
        vrfCoordinatorV2Adress = contract.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReciept = await transactionResponse.wait()

        subscriptionId = transactionReciept.logs[0].topics[1]

        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUT)
    } else {
        vrfCoordinatorV2Adress = networkConfig[chainId]["VRFCoordinatorV2Mock"]
        subscriptionId = network[chainId]["subscriptionId"]
    }
    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]
    const args = [
        vrfCoordinatorV2Adress,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval,
    ]
    console.log("creating contract...")
    const raffle = await deploy("Raffle", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    //verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSAN_API_KEY) {
        log("verifying...")
        await verfiy(raffle.address, arguments)
    }
    log("________________________________________________________________")
}

module.exports.tags = ["all", "raffle"]
