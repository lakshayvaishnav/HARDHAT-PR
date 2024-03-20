import React from "react";
import { useWeb3Contract } from "react-moralis";

const LotteryEnterance = () => {
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    // abi://,
    // contractAddress://,
    // functionName: //,
    // params:{},
    // msgValue://,
  
});
  return <div>Hii from LotteryEnterance</div>;
};

export default LotteryEnterance;
