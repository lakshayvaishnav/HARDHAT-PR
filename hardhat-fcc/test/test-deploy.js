const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

// describing test....

describe("SimpleStorage", function () {
  let simpleStorage, SimpleStorage;
  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("shoul start with a favourite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";

    assert.equal(currentValue.toString(), expectedValue);
  });

  it("should update when we call store", async function () {
    const expextedValue = "7";
    const transactionResponse = await simpleStorage.store(expextedValue);
    await transactionResponse.wait(1);

    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expextedValue);
  });
});
