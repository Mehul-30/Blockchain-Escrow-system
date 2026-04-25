import { useEffect } from "react";
import socket from "../Config/socket";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import EscrowABI from "../../../smart_contract/artifacts/contracts/EscortContract.sol/EscrowUPI.json";
import { BACKEND_URL, CONTRACT_ADDRESS } from "../Config/config";

const NotificationListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const userId = jwtDecode(token).id;

    // join socket room
    socket.emit("join", userId);

    // Handle normal notifications
    socket.on("notification", (data) => {
      console.log("Notification:", data);

      // If seller approved → redirect buyer
      if (data.requestId) {
        const go = window.confirm(
          data.message + "\n\nClick OK to confirm purchase."
        );

        if (go) {
          navigate("/createEscrow", {
            state: { requestId: data.requestId },
          });
        }
      } else {
        alert(data.message);
      }
    });

    // Escrow trigger (ONLY place escrow is created)
    socket.on("createEscrow", async (data) => {
      try {
        if (!window.ethereum) {
          alert("Install MetaMask!");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const buyer = await signer.getAddress();

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          EscrowABI.abi,
          signer
        );

        // create escrow on blockchain
        const tx = await contract.createEscrow(data.seller, {
          value: ethers.parseEther(data.amount.toString()),
        });

        const receipt = await tx.wait();

        // extract escrowId from event
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

        if (!escrowId) {
          alert("Escrow ID not found!");
          return;
        }

        // store escrow in backend
        await axios.post(`${BACKEND_URL}/api/escrow/store`, {
          escrowId,
          buyer,
          seller: data.seller,
          amountEth: data.amount,
          userId,
        });

        alert("Escrow created successfully!");

      } catch (err) {
        console.error(err);
        alert("Escrow creation failed");
      }
    });

    return () => {
      socket.off("notification");
      socket.off("createEscrow");
    };
  }, [navigate]);

  return null;
};

export default NotificationListener;