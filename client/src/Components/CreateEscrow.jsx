import React, { useState } from "react";
import { ethers } from "ethers";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BACKEND_URL, CONTRACT_ADDRESS } from "../Config/config";
import EscrowABI from "../../../smart_contract/artifacts/contracts/EscortContract.sol/EscrowUPI.json";

const CreateEscrow = () => {
  const [seller, setSeller] = useState("");
  const [amount, setAmount] = useState("");

  const handleCreate = async () => {
    if (!window.ethereum) return alert("Install MetaMask first!");
    if (!seller || !amount) return alert("Enter all fields");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const buyer = await signer.getAddress(); 
      
      
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to list a product!");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        EscrowABI.abi,
        signer
      );

      // Create escrow on-chain
      const tx = await contract.createEscrow(seller, {
        value: ethers.parseEther(amount),
      });

      const receipt = await tx.wait();

      console.log("Escrow Created:", receipt);
      alert("Escrow created successfully!");

      // Proper event extraction
      let escrowId = null;
      const iface = new ethers.Interface(EscrowABI.abi);

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.name === "EscrowCreated") {
            escrowId = parsed.args.escrowId.toString();
            break;
          }
        } catch {}
      }

      console.log("Escrow ID:", escrowId);

      if (!escrowId) return alert("Could not extract escrowId from blockchain!");

      // Save escrow details to backend
      const store = await axios.post(`${BACKEND_URL}/create`, {
        buyer,        
        seller,
        amountEth: amount,
        escrowId,
        userId,
      });

      console.log("Saved to backend:", store.data);

    } catch (err) {
      console.error(err);
      alert("Error creating escrow");
    }
  };

  return (
    <div>
      <h3>Place Order By Creating Escrow</h3>

      <input
        type="text"
        placeholder="Seller Address"
        value={seller}
        onChange={(e) => setSeller(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleCreate}>Create Escrow</button>
    </div>
  );
};

export default CreateEscrow;
