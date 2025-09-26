require('dotenv').config()
require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API,
      accounts: [process.env.META_MASK_ACC1_PVT],
    }
  }
};