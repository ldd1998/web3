#!/usr/bin/env bash
set -e

export ENV_ENC_PASSWORD="liu15853087850"
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7891

npx hardhat test