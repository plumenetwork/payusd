import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import type { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

// Existing PlumeOFT on Ethereum mainnet (address known in repo configs)
const ethereumMainnetContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    address: '0xbDA8a2285F4C3e75b37E467C4DB9bC633FfbD29d',
}

// PlumeOFT to be deployed on BSC mainnet
const bscMainnetContract: OmniPointHardhat = {
    eid: EndpointId.BSC_V2_MAINNET,
    contractName: 'PlumeOFT',
}

const ENFORCED: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
]

export default async function () {
    const connections = await generateConnectionsConfig([
        [
            ethereumMainnetContract,
            bscMainnetContract,
            [['LayerZero Labs', 'Google'], []],
            [20, 15],
            [ENFORCED, ENFORCED],
        ],  
    ])

    return {
        contracts: [
            { contract: ethereumMainnetContract },
            { contract: bscMainnetContract },
        ],
        connections,
    }
}


