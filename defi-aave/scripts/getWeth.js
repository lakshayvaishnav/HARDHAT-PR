const { getNamedAccounts, deployments, ethers } = require("hardhat")

const AMOUNT = ethers.parseEther("0.02")
async function getWeth() {
    console.log("script is running")
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)

    const iweth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        signer
    )

    const tx = await iweth.deposit({ value: AMOUNT })
    await tx.wait(1)
    const wethBalance = await iweth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} this much weth ...`)
}

module.exports = {
    getWeth,
    AMOUNT,
}
