import React, { useEffect } from "react";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";


const LotteryEnterance = () => {
  const { chainId: chainHex, isWeb3Enabled } = useMoralis(); // pull out chainId object and rename it to chainHex
  const chainId = parseInt(chainHex);

  console.log("chain id : ", parseInt(chainHex));

  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  // const { runContractFunction: enterRaffle } = useWeb3Contract({  // runcontractFunction function (comes with moralis) can both send transactions and read state.
  //   abi: abi,
  //   contractAddress:raffleAddress,
  //   functionName: "enterRaffle",
  //   params:{},
  //   msgValue:,
  // });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: " getEntranceFee",
    params: {},
  });

  useEffect(() => {
    console.log("use effect running");
    if (isWeb3Enabled) {
      // try to read the raffle enterance fee...
      async function updateUI() {
        const something = await getEntranceFee();

        console.log("something :  ", something);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);
  return <div>Hii from LotteryEnterance</div>;
};

export default LotteryEnterance;
