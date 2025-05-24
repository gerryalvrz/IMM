require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org/",
      chainId: 44787,
      accounts: [""],
      // optional:
      // gasPrice: 1_000_000_000,       // 1 GWei
      // gasMultiplier: 1.2
    }
  },
  paths: {
    sources:   "./contracts",
    tests:     "./test",
    cache:     "./cache",
    artifacts: "./artifacts"
  }
};
