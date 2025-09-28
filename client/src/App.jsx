// import React, { useState, useContext} from "react"

// function App() {
//   const [formData, setFormData] = useState({
//     receiver: "",
//     amount: "",
//     message: "",
//     keyword: ""
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Form submitted:\nReceiver: ${formData.receiver}\nAmount: ${formData.amount}\nMessage: ${formData.message}\nKeyword: ${formData.keyword}`);
//     setFormData({ receiver: "", amount: "", message: "", keyword: "" });
//   };

//   // const data = useContext(TransactionContext)
//   // console.log(data);

//   return (

//     <div className="app-container">
//       <h1 className="app-title">Transactions DApp (Frontend Only)</h1>

//       <form className="form-section" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Receiver Address"
//           value={formData.receiver}
//           onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Amount"
//           value={formData.amount}
//           onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Message"
//           value={formData.message}
//           onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Keyword"
//           value={formData.keyword}
//           onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
//         />

//         <button type="submit" className="button">
//           Send Transaction
//         </button>
//       </form>
//     </div>
//   );
// }

// export default App;
import React, { useState, useContext } from "react";
import { TransactionContext } from './context/TransactionContext';

function App() {
  const { currentAccount, connectWallet } = useContext(TransactionContext);

  const [formData, setFormData] = useState({
    receiver: "",
    amount: "",
    message: "",
    keyword: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentAccount) return alert("Please connect your wallet first!");
    
    alert(`Form submitted:\nSender: ${currentAccount}\nReceiver: ${formData.receiver}\nAmount: ${formData.amount}\nMessage: ${formData.message}\nKeyword: ${formData.keyword}`);
    
    setFormData({ receiver: "", amount: "", message: "", keyword: "" });
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Transactions DApp</h1>

      {!currentAccount && (
        <button className="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      {currentAccount && <p>Connected Account: {currentAccount}</p>}

      <form className="form-section" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Receiver Address"
          value={formData.receiver}
          onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
        <input
          type="text"
          placeholder="Keyword"
          value={formData.keyword}
          onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
        />

        <button type="submit" className="button">
          Send Transaction
        </button>
      </form>
    </div>
  );
}

export default App;
