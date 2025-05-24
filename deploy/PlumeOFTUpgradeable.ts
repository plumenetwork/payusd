import { assert } from 'console'

import { Wallet } from 'ethers'
import { type DeployFunction } from 'hardhat-deploy/types'

import { CHAIN_IDS, useBigBlock, useSmallBlock } from '@layerzerolabs/hyperliquid-composer'
import { EndpointId, endpointIdToNetwork } from '@layerzerolabs/lz-definitions'
import { getDeploymentAddressAndAbi } from '@layerzerolabs/lz-evm-sdk-v2'

const contractName = 'PlumeOFT'

const deploy: DeployFunction = async (hre) => {
    const { deploy } = hre.deployments
    const signer = (await hre.ethers.getSigners())[0]
    const deployer = signer.address

    const networkName = hre.network.name
    // Grab the private key used to deploy to this network from hardhat.config.ts -> networks -> networkName -> accounts
    const privateKey = hre.network.config.accounts
    assert(
        privateKey,
        `Can not find a private key associated with hre.network.config.accounts for the network ${networkName} in hardhat.config.ts`
    )
    // Get logger from hardhat flag --log-level
    const loglevel = hre.hardhatArguments.verbose ? 'debug' : 'info'

    const wallet = new Wallet(privateKey.toString())

    const chainId = (await hre.ethers.provider.getNetwork()).chainId
    const isHyperliquid = chainId === CHAIN_IDS.MAINNET || chainId === CHAIN_IDS.TESTNET
    const isTestnet = chainId === CHAIN_IDS.TESTNET

    // Switch to hyperliquidbig block if the contract is not deployed
    const isDeployed_oft = await hre.deployments.getOrNull(contractName)

    if (!isDeployed_oft && isHyperliquid) {
        console.log(`Switching to hyperliquid big block for the address ${deployer} to deploy ${contractName}`)
        const res = await useBigBlock(wallet, isTestnet, loglevel)
        console.log(JSON.stringify(res, null, 2))
        console.log(`Deplying a contract uses big block which is mined at a transaction per minute.`)
    }

    console.log(`deploying ${contractName} on network: ${hre.network.name} with ${signer.address}`)

    const eid = hre.network.config.eid as EndpointId
    const lzNetworkName = endpointIdToNetwork(eid)

    const { address } = getDeploymentAddressAndAbi(lzNetworkName, 'EndpointV2')

    await deploy(contractName, {
        from: signer.address,
        args: [address],
        log: true,
        waitConfirmations: 1,
        skipIfAlreadyDeployed: true,
        proxy: {
            proxyContract: 'OpenZeppelinTransparentProxy',
            owner: signer.address,
            execute: {
                init: {
                    methodName: 'initialize',
                    args: ['Plume', 'PLUME', signer.address], // TODO: add name/symbol
                },
            },
        },
    })

    // Set small block eitherway as we do not have a method to check which hyperliquidblock we are on
    if (isHyperliquid) {
        console.log(`Using small block with address ${deployer} for faster transactions`)
        const res = await useSmallBlock(wallet, isTestnet, loglevel)
        console.log(JSON.stringify(res, null, 2))
    }
}

deploy.tags = [contractName]

export default deploy
