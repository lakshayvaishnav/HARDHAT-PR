// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OurToken is ERC20 {
    
    constructor (uint256 inititalSupply) ERC20("OurToken","OT")
    _mint(msg.sender,  inititalSupply)
}
