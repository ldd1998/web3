// 测试合约fundme
const {ethers,deployments,getNamedAccounts} = require('hardhat')
const {assert} = require('chai')

describe('test fundme', () => {
    console.log("test fundme")
    let fundMe, firstAccount
    beforeEach(async () => {
        await deployments.fixture(["FundMe"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeploy =await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeploy.address)
    })
    it('test if the owner is msg.sender', async () => {
        assert.equal(await fundMe.owner(), await firstAccount)
    })
    it('test if the owner is msg.sender', async () => {
        assert.equal(await fundMe.owner(), await firstAccount)
    })
})
describe('test fundme2', () => {
    it('test if the owner is msg.sender', async () => {
        const [owner] = await ethers.getSigners()
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = await fundMeFactory.deploy(300)
        assert.equal(await fundMe.owner(), owner.address)
    })
})