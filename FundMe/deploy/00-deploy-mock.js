// 从 hardhat 中获取 getNamedAccounts 函数
// const {getNamedAccounts} = require("hardhat")
const {DECIMALS, INIT_IAL_ANSWER, developmentChains, networkConfig} = require("../helper-hardhat-config")
const {network} = require("hardhat");
// 导出部署函数
module.exports = async ({getNamedAccounts, deployments}) => {
    if (developmentChains.include(network.name)) {
        // 从 deployments 中获取 deploy 函数
        const {deploy} = deployments
        // 获取第一个和第二个账户
        const firstAccount = (await getNamedAccounts()).firstAccount

        // 部署 FundMe 合约
        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMALS, INIT_IAL_ANSWER],
            log: true
        })
    }else {
        console.log("network no sepolia,mock deploy skip")
    }
}
// 设置脚本标签
module.exports.tags = ["all", "mock"]
