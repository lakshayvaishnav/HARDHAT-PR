const { assert, expect } = require("chai");
const { getNamedAccounts, deployments } = require("hardhat");
const { ethers } = require("hardhat");
const {
  experimentalAddHardhatNetworkMessageTraceHook,
} = require("hardhat/config");

describe("fund me", function () {
  let mockV3Aggregator;
  let fundMe;
  let deployer;

  const sendValue = ethers.parseEther("1");

  beforeEach(async () => {
    // const accounts = await ethers.getSigners()
    //  deployer = accounts[0]

    deployer = (await getNamedAccounts()).deployer; // this code is retrieving the  named account using a custom function and storing it in a variable for future use.
    await deployments.fixture(["all"]); // is a code statement that deploys contracts and prepares them for testing using a fixture configuration.
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", function () {
    it("sets the aggregator addresses correctly", async () => {
      const response = await fundMe.getPriceFeed();
      assert.equal(response, mockV3Aggregator.target);
    });
  });

  describe("fund", function () {
    it("fails when not enough eth is sent...", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });

    it("updated the amount funded data structure", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.getAddressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });

    it("adds funder to array of funders", async function () {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.getFunder(0);
      assert.equal(funder, deployer);
    });
  });

  describe("withdraw", function () {
    this.beforeEach(async function () {
      await fundMe.fund({ value: sendValue });
    });
    it("withdraw eth from single founder", async function () {
      //Arrange
      const startingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      );
      const startingDeployerBalance = await ethers.provider.getBalance(
        deployer
      );

      //Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait();
      console.log(transactionReceipt);
      const { gasUsed, cumulativeGasUsed } = transactionReceipt;
      const gasCost = gasUsed * cumulativeGasUsed;
      // const gasCost = BigInt(gasUsed) * BigInt(effectiveGasPrice);

      const endingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      );
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);

      //Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        (startingFundMeBalance + (startingDeployerBalance)).toString(),
        (endingDeployerBalance + (gasCost)).toString()
      );
    });
  });
});
