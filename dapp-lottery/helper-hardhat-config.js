const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
        keepersUpdateInterval:"30",
    },
    31337:{
        name:"localhost",
        subscriptionId : "588",
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    developmentChains,
    networkConfig
}