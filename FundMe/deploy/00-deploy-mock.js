// 从 hardhat 中获取 getNamedAccounts 函数
// const {getNamedAccounts} = require("hardhat")
const {DECIMALS,INIT_IAL_ANSWER} = require("../helper-hardhat-config")
// 导出部署函数
module.exports = async ({getNamedAccounts, deployments}) => {
    // 从 deployments 中获取 deploy 函数
    const {deploy} = deployments
    // 获取第一个和第二个账户
    const firstAccount = (await getNamedAccounts()).firstAccount

    // 部署 FundMe 合约
    await deploy("MockV3Aggregator",{
        from: firstAccount,
        args:[DECIMALS,INIT_IAL_ANSWER],
        log:true
    })
}
// 设置脚本标签
module.exports.tags = ["all","mock"]
