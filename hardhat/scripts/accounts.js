async function main() {
  const accounts = await ethers.getSigners();
  console.log("printing all the accounts for you aaka :- ");
  for (const account of accounts) {
    console.log(account.address);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

