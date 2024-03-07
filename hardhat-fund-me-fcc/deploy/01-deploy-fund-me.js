const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
require("dotenv").config();

module.exports = async (hre) => {
  const { deployments, getNameAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;
  console.log("deploy scripts running fundme.js ", chainId);

  let ethUdePriceFeedAddress;
  if (chainId === 31337) {
    const ethUdeAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUdeAggregator.address;
    console.log(ethUdePriceFeedAddress);
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  log("----------------------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations....");
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    deterministicDeployment: false,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  console.log("fund me deployed at ", fundMe.address);
};
