import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import type { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const plumePhoenixContract: OmniPointHardhat = {
    eid: EndpointId.PLUMEPHOENIX_V2_MAINNET,
    contractName: 'PlumeOFT',
}

const bscMainnetContract: OmniPointHardhat = {
    eid: EndpointId.BSC_V2_MAINNET,
    contractName: 'PlumeOFT',
}

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 120000,
        value: 0,
    },
]

export default async function () {
    // Bidirectional pathway: PlumePhoenix <-> BSC
    const connections = await generateConnectionsConfig([
        [
            plumePhoenixContract,
            bscMainnetContract,
            [['LayerZero Labs', 'Stargate'], []],
            [5, 5],
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],
    ])

    return {
        contracts: [{ contract: plumePhoenixContract }, { contract: bscMainnetContract }],
        connections,
    }
}


