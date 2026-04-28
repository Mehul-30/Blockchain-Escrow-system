import { useEffect, useRef } from "react";
import socket from "../Config/socket";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import EscrowABI from "../../../smart_contract/artifacts/contracts/EscortContract.sol/EscrowUPI.json";
import { BACKEND_URL, CONTRACT_ADDRESS } from "../Config/config";

const NotificationListener = () => {
  const navigate = useNavigate();
  const processingRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const userId = jwtDecode(token).id;

    // ✅ Join room
    console.log("Joining room:", userId);
    socket.emit("join", userId.toString());

    // =========================
    // 🔔 Purchase Notification
    // =========================
    socket.off("notification").on("notification", (data) => {
      console.log("Notification received:", data);

      if (data.requestId) {
        navigate("/createEscrow", {
          state: { requestId: data.requestId },
        });
      } else {
        alert(data.message);
      }
    });

    // =========================
    // 🔐 Credentials Received
    // =========================
    socket.off("credentials").on("credentials", (data) => {
      console.log("🔥 RECEIVED CREDENTIALS:", data);

      if (!data || !data.credentials) {
        console.error("Invalid credentials data");
        return;
      }

      navigate("/credentials", {
        state: {
          escrowId: data.escrowId,
          credentials: data.credentials,
        },
        replace: true, 
      });
    });

    socket.off("createEscrow").on("createEscrow", async (data) => {
      if (processingRef.current) return;
      processingRef.current = true;

      try {
        console.log("CreateEscrow event:", data);

        if (!window.ethereum) {
          alert("Install MetaMask!");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const buyer = await signer.getAddress();

        const network = await provider.getNetwork();
        if (network.chainId !== 31337n) {
          alert("Switch to localhost network");
          return;
        }

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          EscrowABI.abi,
          signer
        );

        if (!data.amount || Number(data.amount) <= 0) {
          alert("Invalid amount");
          return;
        }

        const tx = await contract.createEscrow(data.seller, {
          value: ethers.parseEther(data.amount.toString()),
        });

        alert("Transaction sent...");
        const receipt = await tx.wait();

        let escrowId = null;
        const iface = new ethers.Interface(EscrowABI.abi);

        for (const log of receipt.logs) {
          if (log.address.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase())
            continue;

          try {
            const parsed = iface.parseLog(log);
            if (parsed && parsed.name === "EscrowCreated") {
              escrowId = parsed.args[0].toString();
              break;
            }
          } catch {}
        }

        if (!escrowId) throw new Error("Escrow ID not found");

        // Store in backend
        await axios.post(`${BACKEND_URL}/escrow/store`, {
          escrowId,
          buyer,
          seller: data.seller,
          amountEth: data.amount,
          product_id: data.product_id || null,
        });

        console.log("Escrow stored successfully");
        alert("Escrow created successfully");

      } catch (err) {
        console.error(err);
        alert(err.message || "Escrow creation failed");
      } finally {
        processingRef.current = false;
      }
    });

    return () => {
      socket.off("notification");
      socket.off("createEscrow");
      socket.off("credentials");
    };

  }, [navigate]);

  return null;
};

export default NotificationListener;