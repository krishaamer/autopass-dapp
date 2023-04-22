const { ethers } = require("hardhat");

const networkConfig = {
  5: {
    name: "goerli",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D", //chainLink官方部署的合約地址
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: "8402",
    callbackGasLimit: "500000", //500,000
    interval: "30", //每30秒檢查一次
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e", // goerli 測試網上的eth/usd 餵價智能合約地址
    mintFee: ethers.utils.parseEther("0.01"),
  },
  31337: {
    name: "hardhat",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    callbackGasLimit: "500000", //500,000
    interval: "30",
    mintFee: ethers.utils.parseEther("0.01"),
  },
  100: {
    name: "gnosis",
    entranceFee: ethers.utils.parseEther("0.001"),
    ethUsdPriceFeed: "0xa767f745331D267c7751297D982b050c93985627",
  },
};

const developmentChains = ["hardhat", "localhost"];

const DECIMALS = "8";
//定義小數點後8位
const INITIAL_ANSWER = "130000000000";
//定義以太幣對美元為1300元,然後小數點八位所以再加上8個0

const frontEndContractsFile2 = "../nextjs-nft-marketplace-thegraph/constants/networkMapping.json";
const frontEndAbiLocation2 = "../nextjs-nft-marketplace-thegraph/constants/";

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
  frontEndContractsFile2,
  frontEndAbiLocation2,
};
