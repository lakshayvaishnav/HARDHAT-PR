const fs = require("fs")
require("dotenv").config()
const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

const FRONT_END_ADDRESSSES_FILE = "../nextjs-dapp-lottery/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-dapp-lottery/constants/abi.json"
module.exports = async function ({ getNamedAccounts, deployments }) {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        updateContractAddress(getNamedAccounts, deployments)
        updateAbi(getNamedAccounts, deployments)
    }
}

async function updateAbi(getNamedAccounts, deployments) {
    console.log("update abi running...")
    const raffle = await deployments.get("Raffle")
    // console.log(raffle)
    const iface = new ethers.Interface(raffle.abi)
    // console.log(iface)
    const formattedAbi = iface.format(ethers.formatEther)
    // console.log("formatted abi : ", formattedAbi)

    fs.writeFileSync(FRONT_END_ABI_FILE, JSON.stringify(formattedAbi))
}

async function updateContractAddress(getNamedAccounts, deployments) {
    console.log("update contract address running...")
    const raffle = await deployments.get("Raffle")
    const chainID = network.config.chainId.toString()
    // console.log("chain id : ", chainID)

    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSSES_FILE, "utf8"))
    console.log(currentAddresses, "these are current addresses")

    if (chainID in currentAddresses) {
        console.log("first if statement is running...")
        if (!currentAddresses[chainID].includes(raffle.address)) {
            currentAddresses[chainID].push(raffle.address)
            console.log("raffle address is pushed ", raffle.address)
        }
    } else {
        currentAddresses[chainID] = [raffle.address]
        console.log("else statement is running...")
        console.log(currentAddresses[chainID])
        console.log(chainID)
    }
    fs.writeFileSync(FRONT_END_ADDRESSSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontEnd"]
