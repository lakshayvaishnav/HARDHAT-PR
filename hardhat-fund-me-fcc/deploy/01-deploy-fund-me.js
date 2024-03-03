const { network } = require("hardhat");
const {
  TASK_TEST_RUN_MOCHA_TESTS,
} = require("hardhat/builtin-tasks/task-names");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId === 31337) {
    const ethUSDAggregator = await deployments.get("MockV3Aggregator");
    ethUSDPriceFeedAddress = ethUSDAggregator.address;
  } else {
    ethUsdPriceFeedAddress = network.config[chainId]["ethUsdPriceFeed"];
  }

  log("_____________________________________________");
  log("deploying fund me and waiting for confirmation....");

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUSDPriceFeedAddress],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("Fund Me deployed at : ", fundMe.address);
};

module.exports.tags = ["all", "fundme"];
