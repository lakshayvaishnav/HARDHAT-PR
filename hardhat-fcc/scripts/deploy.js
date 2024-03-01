const { ethers, run, network } = require("hardhat");

//async main
async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await simpleStorageFactory.deploy();

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");

    await simpleStorage.deploymentTransaction().wait(6);
    await verify(simpleStorage.target, []);

    //________________________
  }

  const currentValue = await simpleStorage.retrieve();
  console.log(`current value is : ${currentValue}`);

  // update the current value:
  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`the updated value is : ${updatedValue}`);
}


//   async function verify
const verify = async (contractAddress, args) => {
  console.log("verifying contract using verify function...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("alread exits");
    } else {
      console.log(error);
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
