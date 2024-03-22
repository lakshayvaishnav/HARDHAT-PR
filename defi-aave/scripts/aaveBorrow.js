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
    const { availableBorrowsETH, totalDebthETH } = await getBorrowUserData(lendingPool, signer)
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
        await lendingPool.getUserAccountData(account)
    console.log(`you have ${totalCollateralETH} worth of ETH depositied`)
    console.log(`you have ${totalDebtETH} worth of ETH borrowed `)
    console.log(`you can borrow ${availableBorrowsETH} worth of ETH`)
    return { availableBorrowsETH, totalDebthETH }
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

main()
    .then(() => process.exit(0))
    .catch((err) => console.error(err))
