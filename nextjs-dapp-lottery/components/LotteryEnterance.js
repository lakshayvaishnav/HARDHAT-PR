import React, { useEffect, useState } from "react";

import { abi, contractAddresses } from "../constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";

const LotteryEnterance = () => {
  const { chainId: chainHex, isWeb3Enabled } = useMoralis(); // pull out chainId object and rename it to chainHex
  const [entranceFee, setentranceFee] = useState("0");
  const dispatch = useNotification();

  const chainId = parseInt(chainHex);

  console.log("chain id : ", parseInt(chainHex));

  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  console.log("raffle address : ", raffleAddress);

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
  };

  const handleNewNotification = function () {
    dispatch({
      type: "success",
      message: "Raffle Entered Successfully",
      title: "TRANSACTION Notification",
      position: "topR",
    });
  };

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    // runcontractFunction function (comes with moralis) can both send transactions and read state.
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  useEffect(() => {
    console.log("use effect running");
    if (isWeb3Enabled) {
      // try to read the raffle enterance fee...
      async function updateUI() {
        const entranceFeeFromCall = JSON.stringify(await getEntranceFee());
        console.log("Entrance fee ", entranceFeeFromCall);

        // for now use hardcoded value will see this later...
        setentranceFee(100000000000);

        console.log("entranceFee :  ", entranceFee);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);
  return (
    <div>
      Hii from lotter enterance{" "}
      {raffleAddress ? (
        <div>
          Hii from LotteryEnterance Fees : {entranceFee} GWEI
          <button
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            Enter Raffle
          </button>
        </div>
      ) : (
        <div>no raffle address found</div>
      )}
    </div>
  );
};

export default LotteryEnterance;
