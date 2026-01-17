// 从 hardhat 中获取 getNamedAccounts 函数
// const {getNamedAccounts} = require("hardhat")
// 导出部署函数
const {networks} = require("../hardhat.config");
const {network} = require("hardhat");
const {developmentChains, networkConfig, LOCK_TIME,CONFIRMATIONS} = require("../helper-hardhat-config")
module.exports = async ({getNamedAccounts, deployments}) => {
    // 从 deployments 中获取 deploy 函数
    const {deploy} = deployments
    // 获取第一个和第二个账户
    const firstAccount = (await getNamedAccounts()).firstAccount
    const secondAccount = (await getNamedAccounts()).secondAccount
    let dataFeedAddress
    if (developmentChains.includes(network.name)) {
        const mockV3Aggregator = await deployments.get("MockV3Aggregator");
        dataFeedAddress = mockV3Aggregator.address;
    } else {
        dataFeedAddress = networkConfig[network.config.chainId].ethUsdDataFeed
    }
    // 部署 FundMe 合约
    const fundeMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, dataFeedAddress],
        log: true,
        // waitConfirmations:CONFIRMATIONS
    })
    // verify
    if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await hre.run("verify:verify", {
            address: fundeMe.address,
            constructorArguments: [LOCK_TIME, dataFeedAddress]
        })
    } else {
        console.log("network is not sepolia,verify skip")
    }
}
// 设置脚本标签
module.exports.tags = ["all", "FundMe"]
