const { getWeth } = require("./getWeth")

async function main() {
    // the protocol treats everything as erc20 token
    await getWeth()
}

main()
    .then(() => process.exit(0))
    .catch((err) => console.error(err))
