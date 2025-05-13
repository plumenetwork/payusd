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
        },
        {
            contract: ethereumMainnetContract,
            config: {
                owner: '0xE13B74186741bA6C23c870F97Ede36BcD6FD0e97',
                delegate: '0xE13B74186741bA6C23c870F97Ede36BcD6FD0e97',
            },
        },
    ],
    connections: [
        {
            from: ethereumMainnetContract,
            to: hyperliquidMainnetContract,
            config: {
                enforcedOptions: [
                    {
                        msgType: MsgType.SEND,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: 100_000, // gas limit in wei for EndpointV2.lzReceive
                        value: 0, // msg.value in wei for EndpointV2.lzReceive
                    },
                ],
                sendLibrary: '0xbB2Ea70C9E858123480642Cf96acbcCE1372dCe1',
                receiveLibraryConfig: {
                    receiveLibrary: '0xc02Ab410f0734EFa3F14628780e6e695156024C2',
                    gracePeriod: BigInt(0),
                },
                sendConfig: {
                    executorConfig: {
                        maxMessageSize: 10_000,
                        executor: '0x173272739Bd7Aa6e4e214714048a9fE699453059',
                    },
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x589dedbd617e0cbcb916a9223f4d1300c294236b'],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x589dedbd617e0cbcb916a9223f4d1300c294236b'],
                    },
                },
            },
        },
    ],
}

export default config
