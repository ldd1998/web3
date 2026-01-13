#!/usr/bin/env bash
set -e

export ENV_ENC_PASSWORD="liu15853087850"
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7891

npx hardhat run scripts/deployFundMe.js --network sepolia

# npx hardhat verify --network sepolia 0xBF11d6B884c6A171fb6A410dB3bfB736117E1545 "10"
# npx hardhat test
# npx hardhat deploy --tags FundMe