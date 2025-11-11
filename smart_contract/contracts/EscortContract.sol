// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


contract EscrowContract{

    struct EscrowStruct{
        address sender;
        address receiver;
        uint amount;
        uint256 timestamp;
    }
}