//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

// 1. 创建一个收款函数
// 2. 记录投资人并且查看
// 3. 在锁定期内，达到目标值，生产商可以提款
// 4. 在锁定期内，没有达到目标值，投资人在锁定期以后退款

contract FundMe {
    /**
     * @dev 记录每个投资人投资的 ETH 金额（已转换为 USD 精度）
     */
    mapping(address => uint256) public fundersToAmount;

    /**
     * @dev 最小投资额度，单位为 10^18 (即 1 USD，18位小数)
     */
    uint256 constant MINIMUM_VALUE = 1 * 10 ** 18; //USD

    /**
     * @dev Chainlink 价格馈送接口
     */
    AggregatorV3Interface internal dataFeed;

    /**
     * @dev 众筹目标值，单位为 10^18 (即 1000 USD)
     */
    uint256 constant TARGET = 1000 * 10 ** 18;

    /**
     * @dev 合约所有者地址
     */
    address public owner;

    /**
     * @dev 合约部署时的时间戳
     */
    uint256 deploymentTimestamp;
    
    /**
     * @dev 众筹锁定期时长（秒）
     */
    uint256 lockTime;

    /**
     * @dev 允许修改投资人金额的 ERC20 合约地址
     */
    address erc20Addr;

    /**
     * @dev 标识筹款是否成功提取的标志
     */
    bool public getFundSuccess = false;

    /**
     * @dev 构造函数，初始化价格馈送地址和锁定期
     * @param _lockTime 锁定期时长
     */
    constructor(uint256 _lockTime,address _dataFeed) {
        // sepolia testnet
        dataFeed = AggregatorV3Interface(_dataFeed);
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    /**
     * @dev 投资函数，允许用户发送 ETH 进行投资
     */
    function fund() external payable {
        require(convertEthToUsd(msg.value) >= MINIMUM_VALUE, "Send more ETH");
        require(block.timestamp < deploymentTimestamp + lockTime, "window is closed");
        fundersToAmount[msg.sender] = msg.value;
    }

    /**
     * 从 Chainlink 获取最新的 ETH/USD 价格
     * 返回值的单位：10^8 (即带 8 位小数的整数)
     * 例如：返回 2500,00000000 表示 $2500 USD
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    /**
     * 将 ETH 金额转换为 USD
     * @param ethAmount 输入单位为 Wei (10^18)
     * @return 返回值单位为 10^18 (USD 的 18 位精度表示，方便与合约中的常量进行比较)
     */
    function convertEthToUsd(uint256 ethAmount) internal view returns(uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
    }

    /**
     * @dev 转移合约所有权
     * @param newOwner 新所有者的地址
     */
    function transferOwnership(address newOwner) public onlyOwner{
        owner = newOwner;
    }

    /**
     * @dev 提取筹集的资金。只有在锁定期结束且达到目标金额时，所有者才能调用。
     */
    function getFund() external windowClosed onlyOwner{
        require(convertEthToUsd(address(this).balance) >= TARGET, "Target is not reached");
        // transfer: transfer ETH and revert if tx failed
        // payable(msg.sender).transfer(address(this).balance);

        // send: transfer ETH and return false if failed
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success, "tx failed");

        // call: transfer ETH with data return value of function and bool
        bool success;
        (success, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, "transfer tx failed");
        fundersToAmount[msg.sender] = 0;
        getFundSuccess = true; // flag
    }

    /**
     * @dev 退款函数。只有在锁定期结束且未达到目标金额时，投资人可以调用以收回资金。
     */
    function refund() external windowClosed {
        require(convertEthToUsd(address(this).balance) < TARGET, "Target is reached");
        require(fundersToAmount[msg.sender] != 0, "there is no fund for you");
        bool success;
        (success, ) = payable(msg.sender).call{value: fundersToAmount[msg.sender]}("");
        require(success, "transfer tx failed");
        fundersToAmount[msg.sender] = 0;
    }

    /**
     * @dev 设置特定地址的投资金额。仅允许特定 ERC20 合约地址调用。
     * @param funder 投资人地址
     * @param amountToUpdate 更新后的金额
     */
    function setFunderToAmount(address funder, uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr, "you do not have permission to call this function");
        fundersToAmount[funder] = amountToUpdate;
    }

    /**
     * @dev 设置允许调用 setFunderToAmount 的 ERC20 合约地址
     * @param _erc20Addr ERC20 合约地址
     */
    function setErc20Addr(address _erc20Addr) public onlyOwner {
        erc20Addr = _erc20Addr;
    }

    /**
     * @dev 检查众筹窗口是否已关闭的修饰符
     */
    modifier windowClosed() {
        require(block.timestamp >= deploymentTimestamp + lockTime, "window is not closed");
        _;
    }

    /**
     * @dev 限制仅合约所有者可调用的修饰符
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "this function can only be called by owner");
        _;
    }

}