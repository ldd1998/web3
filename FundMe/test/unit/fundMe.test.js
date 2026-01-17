// 测试合约 FundMe
const {ethers, deployments, getNamedAccounts} = require('hardhat')
const {assert} = require('chai')

// 第一个测试套件：使用 hardhat-deploy 插件的 fixture 功能
describe('test fundme', () => {
    console.log("test fundme")
    let fundMe, firstAccount
    
    // 在每个测试用例运行前执行
    beforeEach(async () => {
        // 部署标注了 "all" 标签的合约（包含 mock 和 FundMe），并创建快照
        await deployments.fixture(["all"])
        // 获取配置文件中定义的第一个账户
        firstAccount = (await getNamedAccounts()).firstAccount
        // 获取已部署合约的信息
        const fundMeDeploy = await deployments.get("FundMe")
        // 获取合约实例以进行交互
        fundMe = await ethers.getContractAt("FundMe", fundMeDeploy.address)
    })

    // 测试用例 1：验证合约所有者是否为部署账户
    it('test if the owner is msg.sender', async () => {
        assert.equal(await fundMe.owner(), await firstAccount)
    })

    // 测试用例 2：重复测试用例（可能是为了演示或后续扩展）
    it('test if the owner is msg.sender', async () => {
        assert.equal(await fundMe.owner(), await firstAccount)
    })
})

// 第二个测试套件：使用标准的 ethers.js 流程手动部署合约进行测试
describe('test fundme2', () => {
    it('test if the owner is msg.sender', async () => {
        // 获取签名者账户列表
        const [owner] = await ethers.getSigners()
        // 获取合约工厂
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        // 手动部署一个新的合约实例，传入构造函数参数 (300, 虚拟地址)
        // 注意：FundMe 构造函数现在需要两个参数：_lockTime 和 _dataFeed
        const fundMe = await fundMeFactory.deploy(300, "0x694AA1769357215DE4FAC081bf1f309aDC325306")
        // 验证部署后的所有者地址是否正确
        assert.equal(await fundMe.owner(), owner.address)
    })
})