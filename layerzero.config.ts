import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities';
import {generateConnectionsConfig} from '@layerzerolabs/metadata-tools';
import type { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const ethereumContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'PayUSDOFTAdapterUpgradeable',
}

const plumePhoenixContract: OmniPointHardhat = {
    eid: EndpointId.PLUMEPHOENIX_V2_MAINNET,
    contractName: 'PayUSDOFTUpgradeable',
}

const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
      msgType: 1,
      optionType: ExecutorOptionType.LZ_RECEIVE,
      gas: 120000,
      value: 0,
    }
  ];
  
  export default async function () {
    // note: pathways declared here are automatically bidirectional
    // if you declare A,B there's no need to declare B,A
    const connections = await generateConnectionsConfig([
      [
        ethereumContract, // Chain A contract
        plumePhoenixContract, // Chain B contract
        [['LayerZero Labs', 'Stargate'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
        [15, 1], // [A to B confirmations, B to A confirmations]
        [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
      ],
    ]);
  
    return {
      contracts: [
            {
              contract: ethereumContract,
              config: {
                delegate: '0xcb7549474fed2d886b60ea2946e56bea2e8bddd3',
                owner: '0xcb7549474fed2d886b60ea2946e56bea2e8bddd3'
              }
            },
            {
              contract: plumePhoenixContract,
              config: {
                delegate: '0x65392FEb0aC862844105EdFd57C5ce58DAbE5362',
                owner: '0x65392FEb0aC862844105EdFd57C5ce58DAbE5362'
              }
            }
      ],
      connections,
    };
  }