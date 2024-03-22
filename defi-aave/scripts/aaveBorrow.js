const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth } = require("./getWeth")

async function main() {
    // the protocol treats everything as erc20 token
    await getWeth()
    const { deployer } = await getNamedAccounts()
    // lending pool adress provider  - 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    const lendingPool = await getLendingPool(deployer)
    console.log(`Lending Pool address ${lendingPool.target}`)
}

async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        // it returns a contract
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )
    const lendingPoolAddress = await lendingPoolAddressesProvider.getAddress()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    return lendingPool
}

main()
    .then(() => process.exit(0))
    .catch((err) => console.error(err))
