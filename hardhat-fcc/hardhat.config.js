require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("./tasks/block-number");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
PRIVATE_KEY = process.env.PRIVATE_KEY;
ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
  solidity: "0.8.24",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
  },

  gasReporter: {
    enabled: true,
    currency: "INR",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
};
