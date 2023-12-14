const path = require("path");
require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "theory reject soda wealth frequent test solve ceiling april infant table liberty";
const infura_sepolia_endpoint = "https://sepolia.infura.io/v3/9c04eeb132eb4b1ba20c8641f4128762";
module.exports = {
  contracts_build_directory: path.join(__dirname, "./src/build/contracts"),
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, infura_sepolia_endpoint),
      network_id: "11155111",
      gas: 3000000, // 이 값을 낮추면 가스 비용을 줄일 수 있습니다.
      gasPrice: 60000000000
    },
  },
  compilers: {
    solc: {
      version: "^0.5.0",
      "optimizer": {
        "enabled": true,
        "runs": 200
      },
      "outputSelection": {
        "*": {
          "*": [
            "evm.bytecode",
            "evm.deployedBytecode",
            "devdoc",
            "userdoc",
            "metadata",
            "abi"
          ]
        },
      },
    },
  },
  plugins: ['truffle-flatten']
};
