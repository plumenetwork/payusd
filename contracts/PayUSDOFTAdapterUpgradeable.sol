// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { OFTAdapterUpgradeable } from "@layerzerolabs/oft-evm-upgradeable/contracts/oft/OFTAdapterUpgradeable.sol";

contract PayUSDOFTAdapterUpgradeable is OFTAdapterUpgradeable {
    constructor(address _token, address _lzEndpoint) OFTAdapterUpgradeable(_token, _lzEndpoint) {
        _disableInitializers();
    }

    function initialize(address _delegate) public initializer {
        __OFTAdapter_init(_delegate);
        __Ownable_init(_delegate);
    }
}
