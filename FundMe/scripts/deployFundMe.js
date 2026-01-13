const {ethers} = require("hardhat")

async function main() {
    const LOCK_TIME = 300
    console.log("Deploying...")
    // 部署FundMe合约
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    // 部署合约
    const fundMe = await fundMeFactory.deploy(LOCK_TIME)
    await fundMe.waitForDeployment();
    // 获取合约地址
    console.log(`Deployed to ${fundMe.target}`)
    // 只有在部署到测试网时才进行验证
    if(hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY){
        // 等待5个区块
        console.log("Waiting for transaction to be mined...")
        await fundMe.deploymentTransaction().wait(5)
        console.log("Transaction mined!")
        // 验证合约
        await verify(fundMe.target, LOCK_TIME)
    }
    // init 2 accounts
    const [owner, addr1] = await ethers.getSigners()
    console.log("Owner:", owner.address)
    // console.log("Addr1:", addr1.address)

    // fund
    const fundTx = await fundMe.fund({value: ethers.parseEther("0.0004")})
    await fundTx.wait()
    console.log("Funding done!")
    console.log("Balance:", (await fundMe.balance()).toString())
}
async function verify(fundMeAddr,args){
    console.log("Verifying...")
    await hre.run("verify:verify", {address: fundMeAddr, constructorArguments: [args]})
    console.log("Verifying Done!")
}

main().then().catch((error) => {
    console.log(error)
})