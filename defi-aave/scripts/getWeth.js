const { getNamedAccounts, ethers } = require("hardhat")

const AMOUNT = ethers.parseEther("0.02")
async function getweth() {
    const { deployer } = getNamedAccounts()
    // call the "deposit" function on the weth contract
    // abi , address

    const iweth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )

    const tx = await iweth.deposit({ value: AMOUNT })
    await tx.wait(1)
    const wethBalance = await iweth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} this much weth ...`)
}

module.exports = {
    getweth,
}
