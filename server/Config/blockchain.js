const { ethers } = require("ethers");
require("dotenv").config();

const contractArtifact = require("../../smart_contract/artifacts/contracts/EscortContract.sol/EscrowUPI.json");
const deployed = require("../../smart_contract/deployedAddress.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(deployed.address, contractArtifact.abi, signer);

console.log(`✅ Connected to Escrow contract at ${deployed.address} on ${deployed.network}`);

module.exports = { contract, provider, signer, ethers };
