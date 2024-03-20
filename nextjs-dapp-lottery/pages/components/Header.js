import React from "react";
import { ConnectButton } from "web3uikit";
const Header = () => {
  return (
    <div>
        DECENTRALIZED LOTTERY
      <ConnectButton moralisAuth={false} />
    </div>
  );
};

export default Header;
