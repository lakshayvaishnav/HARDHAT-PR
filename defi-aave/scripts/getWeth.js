const { getNamedAccounts } = require("hardhat")

async function getweth() {
    const { deployer } = getNamedAccounts()
    // call the "deposit" function on the weth contract
    // abi , address.
}

module.exports = {
    getweth,
}
