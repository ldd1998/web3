require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require("hardhat-deploy")

module.exports = {
    solidity: "0.8.28",
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 11155111
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        firstAccount:{
            default: 0,
        },
        secondAccount:{
            default: 1,
        }
    }
};
