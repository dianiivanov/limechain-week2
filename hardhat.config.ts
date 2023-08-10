import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Sepolia Testnet
    sepolia: {
      url: `https://sepolia.infura.io/v3/931077b33eda43debb37e58530a0150c`,
      chainId: 5,
      accounts: [
        `af5ebf40620e6f25d45c6450223fbafb7090ff4ef203474a32180435131ab1da`,
      ],
    },
  },
};

export default config;
