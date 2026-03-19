import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { BACKEND_URL, CONTRACT_ADDRESS } from "../Config/config";
import EscrowABI from "../../../smart_contract/artifacts/contracts/EscortContract.sol/EscrowUPI.json";

const CreateEscrow = () => {
  const location = useLocation();

  const game = location.state?.game;

  const [seller, setSeller] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (game) {
      setSeller(game.owner);   
      setAmount(game.price);  
    }
  }, [game]);

  const handleCreate = async () => {
    if (!window.ethereum) return alert("Install MetaMask first!");
    if (!seller || !amount) return alert("Missing product data");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const buyer = await signer.getAddress();

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Login required!");
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        EscrowABI.abi,
        signer
      );

      if (!ethers.isAddress(seller)) {
        return alert("Invalid seller address");
      }

      const tx = await contract.createEscrow(seller, {
        value: ethers.parseEther(amount.toString()),
      });

      const receipt = await tx.wait();

      alert("Escrow created successfully!");

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

      if (!escrowId) return alert("Escrow ID not found!");

      await axios.post(`${BACKEND_URL}/create`, {
        buyer,
        seller,
        amountEth: amount,
        escrowId,
        userId,
      });

      console.log("Saved to backend");

    } catch (err) {
      console.error(err);
      alert("Error creating escrow");
    }
  };

  return (
    <div>
      <h3>Create Escrow</h3>

      <input type="text" value={seller} readOnly />

      <input type="text" value={amount} readOnly />

      <button onClick={handleCreate}>Confirm & Pay</button>
    </div>
  );
};

export default CreateEscrow;