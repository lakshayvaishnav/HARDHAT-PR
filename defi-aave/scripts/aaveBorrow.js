const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("./getWeth")

async function main() {
    // the protocol treats everything as erc20 token
    await getWeth()
    const { deployer } = await getNamedAccounts()

    //  !  TODO - able to deposit the collateral to aave which is our AMOUNT
    // lending pool adress provider  - 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    const signer = await ethers.getSigner(deployer)
    const lendingPool = await getLendingPool(signer)
    console.log(`Lending Pool address ${lendingPool.target}`)

    // deposit
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    await approveErc20(wethTokenAddress, lendingPool.target, AMOUNT, signer)
    console.log("Depositing !")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, signer, 0)
    console.log("Deposited !")

    // ! TODO - borrow from aave.
    // ? how much we have borrowed , how much we can borrow , how much we have in collateral.
    const { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(lendingPool, signer)
    const daiPrice = await getDaiPrice(signer)
    const amountToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / parseInt(daiPrice))
    console.log(` ** you can borrow ${amountToBorrow}`)
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)
    console.log(`you have ${totalCollateralETH} worth of ETH depositied`)
    console.log(`you have ${totalDebtETH} worth of ETH borrowed `)
    console.log(`you can borrow ${availableBorrowsETH} worth of ETH`)
    return { availableBorrowsETH, totalDebtETH }
}

async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        // it returns a contract
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )
    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    return lendingPool
}

async function approveErc20(erc20Address, spenderAddress, amount, signer) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, signer)
    txResponse = await erc20Token.approve(spenderAddress, amount)
    await txResponse.wait(1)
    console.log("Approved !")
}

// * we dont need it to connect it to signer because we are not sending any transaction we are only reading value
// ! reading dont needs any signer.
async function getDaiPrice(account) {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616e4d11a78f511299002da57a0a94577f1f4",
        account
    )
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`the DAI/ETH price is ${price} `)
    return price
}

main()
    .then(() => process.exit(0))
    .catch((err) => console.error(err))
