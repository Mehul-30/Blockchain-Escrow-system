const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying EscrowUPI...");

  const EscrowUPI = await hre.ethers.getContractFactory("EscrowUPI");
  const escrow = await EscrowUPI.deploy();

  // Wait for deployment to be mined
  await escrow.waitForDeployment();

  const contractAddress = await escrow.getAddress();
  console.log("EscrowUPI deployed at:", contractAddress);

  // Save deployment info for backend
  const data = {
    address: contractAddress,
    network: hre.network.name,
  };
  fs.writeFileSync("deployedAddress.json", JSON.stringify(data, null, 2));
}

main().catch((error) => {
  console.error("Deployment error:", error);
  process.exit(1);
});
