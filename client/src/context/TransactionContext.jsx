// import React,{useState,useEffect} from 'react';
// import ethers from 'ethers'

// import {contractAbi, contractAddress} from '../utils/constants';

// export const TransactionContext = React.createContext();

// const ethereum = window;

// const getEthereumContract = ()=>{
//     const provider = new ethers.providers.Web3Provider(ethereum)
//     const signer = provider.getSigner();

//     const transactionContract = new ethers.Contract(contractAddress,contractAbi,signer);
// }

// export const TransactionProvider = ({ children }) => {
//     return (
//     <TransactionContext.Provider value={{ value : "test" }}>
//       {children}
//     </TransactionContext.Provider>
//   );
// };

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

// Function to get the contract instance
const getEthereumContract = () => {
  if (!ethereum) return null;

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractAbi, signer);
  console.log("hello");

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);

  // Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert("Please install MetaMask!");

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!ethereum) return alert("Please install MetaMask!");

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        getEthereumContract
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
