import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { BACKEND_URL } from "../Config/config";

const CreateEscrow = () => {
  const location = useLocation();
  const requestId = location.state?.requestId;

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!requestId) {
      alert("Invalid request");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      console.log("Request id : ",requestId);

      await axios.post(`${BACKEND_URL}/purchase/confirm`, {
        requestId,
      });

      alert("Confirmed Waiting for escrow creation...");

    } catch (err) {
      console.error(err);
      alert("Error confirming purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Confirm Purchase</h3>

      <button onClick={handleConfirm} disabled={loading}>
        {loading ? "Processing..." : "Confirm & Proceed"}
      </button>
    </div>
  );
};

export default CreateEscrow;