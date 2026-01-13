// 从 hardhat 中获取 getNamedAccounts 函数
// const {getNamedAccounts} = require("hardhat")
// 导出部署函数
const {networks} = require("../hardhat.config");
module.exports = async ({getNamedAccounts, deployments}) => {
    // 从 deployments 中获取 deploy 函数
    const {deploy} = deployments
    // 获取第一个和第二个账户
    const firstAccount = (await getNamedAccounts()).firstAccount
    const secondAccount = (await getNamedAccounts()).secondAccount
    let dataFeed
    if(network.name === 'hardhat'){
        const mockDataFeed = await deployments.get("MockV3Aggregator")
    }else {
    }
    // 部署 FundMe 合约
    await deploy("FundMe",{
        from: firstAccount,
        args:[300,mockDataFeed],
        log:true
    })
}
// 设置脚本标签
module.exports.tags = ["FundMe"]
