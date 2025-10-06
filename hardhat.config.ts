// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

//import '@openzeppelin/hardhat-upgrades'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-deploy-ethers'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
const { vars } = require("hardhat/config");
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

import './tasks/send'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}
console.log("RPC_URL_BSC_MAINNET",process.env.RPC_URL_BSC_MAINNET);

const config: HardhatUserConfig = {
    plugins: [
        hardhatVerify,

      ],
    paths: {
        cache: 'cache/hardhat',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        'ethereum-mainnet': {
            eid: EndpointId.ETHEREUM_V2_MAINNET,
            url: 'https://gateway.tenderly.co/public/mainnet',
            accounts,
            safeConfig: {
                safeUrl: 'https://api.safe.global/tx-service/eth', // URL of the Safe Transaction Service for the network
                safeAddress: '0x5A85C2998E4a49C5A2857731c007c2Ac16D07eA4' // Address of the Safe wallet for the network
            }
        },
        'plumephoenix-mainnet': {
            eid: EndpointId.PLUMEPHOENIX_V2_MAINNET,
            url: 'https://phoenix-rpc.plumenetwork.xyz',
            accounts,
        },
        
        'bsc-mainnet': {
            eid: EndpointId.BSC_V2_MAINNET,
            url: process.env.RPC_URL_BSC_MAINNET || 'https://bsc-dataseed.binance.org',
            accounts,
            safeConfig: {
                safeUrl: 'https://api.safe.global/tx-service/bnb', // URL of the Safe Transaction Service for the network
                safeAddress: '0x5A85C2998E4a49C5A2857731c007c2Ac16D07eA4' // Address of the Safe wallet for the network
            }
        },
        /*
        'bsc-local': {
            eid: EndpointId.BSC_V2_MAINNET,
            url: 'http://127.0.0.1:8545',
            chainId: 56,
            accounts: [process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'],
        },
        */
        'hyperliquid-mainnet': {
            eid: EndpointId.HYPERLIQUID_V2_MAINNET,
            url: process.env.RPC_URL_HYPEREVM_MAINNET || 'https://rpc.hyperliquid-mainnet.xyz/evm',
            accounts,
        },
        'hyperliquid-testnet': {
            eid: EndpointId.HYPERLIQUID_V2_TESTNET,
            url: process.env.RPC_URL_HYPEREVM_TESTNET || 'https://rpc.hyperliquid-testnet.xyz/evm',
            accounts,
        },

        hardhat: {
            allowUnlimitedContractSize: true,
        }
    },

      etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: {
          bsc: ETHERSCAN_API_KEY
        }
      },

    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
    layerZero: {
        // You can tell hardhat toolbox not to include any deployments (hover over the property name to see full docs)
        deploymentSourcePackages: [],
        // You can tell hardhat not to include any artifacts either
        // artifactSourcePackages: [],
    },
}

export default config
