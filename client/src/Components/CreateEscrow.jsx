import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { BACKEND_URL } from "../Config/config";

const CreateEscrow = () => {
  const location = useLocation();
  const requestId = location.state?.requestId;

  const handleConfirm = async () => {
    if (!requestId) return alert("Invalid request");

    try {
      await axios.post(`${BACKEND_URL}/purchase/confirm`, {
        requestId,
      });

      alert("Waiting for escrow creation...");

    } catch (err) {
      console.error(err);
      alert("Error confirming purchase");
    }
  };

  return (
    <div>
      <h3>Confirm Purchase</h3>
      <button onClick={handleConfirm}>
        Confirm & Proceed
      </button>
    </div>
  );
};

export default CreateEscrow;