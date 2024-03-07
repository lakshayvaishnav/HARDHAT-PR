const networkConfig = {
  31337: {
    name: "localhost",
  },
  11155111: {
    //thid is chainid
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

const developmentChain = ["sepolia", "localhost"];

module.exports = {
  developmentChain,
  networkConfig,
};
