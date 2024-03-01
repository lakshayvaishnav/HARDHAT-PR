const { task } = require("hardhat/config");

task("block-number", "Prints the current block number made by lxsh...").setAction(
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`Current block number : ${blockNumber}`);
  }
);

module.exports = {};
