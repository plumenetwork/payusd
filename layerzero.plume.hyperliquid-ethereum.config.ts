import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

enum MsgType {
    SEND = 1,
}
const hyperliquidMainnetContract: OmniPointHardhat = {
    eid: EndpointId.HYPERLIQUID_V2_MAINNET,
    contractName: 'PlumeOFT',
}

const ethereumMainnetContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    address: '0xbDA8a2285F4C3e75b37E467C4DB9bC633FfbD29d',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: hyperliquidMainnetContract,
            config: {
                owner: '0xdc6Fc79410d356f04B28977e54af8Daf0d60B019',
                delegate: '0xdc6Fc79410d356f04B28977e54af8Daf0d60B019',
            },
        },
        {
            contract: ethereumMainnetContract,
        },
    ],
    connections: [
        {
            from: hyperliquidMainnetContract,
            to: ethereumMainnetContract,
            config: {
                enforcedOptions: [
                    {
                        msgType: MsgType.SEND,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: 100_000, // gas limit in wei for EndpointV2.lzReceive
                        value: 0, // msg.value in wei for EndpointV2.lzReceive
                    },
                ],
                sendLibrary: '0xfd76d9CB0Bac839725aB79127E7411fe71b1e3CA',
                receiveLibraryConfig: {
                    receiveLibrary: '0x7cacBe439EaD55fa1c22790330b12835c6884a91',
                    gracePeriod: BigInt(0),
                },
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10_000,
                        executor: '0x41Bdb4aa4A63a5b2Efc531858d3118392B1A1C3d',
                    },
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0xc097ab8cd7b053326dfe9fb3e3a31a0cce3b526f'],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0xc097ab8cd7b053326dfe9fb3e3a31a0cce3b526f'],
                    },
                },
            },
        },
    ],
}

export default config
