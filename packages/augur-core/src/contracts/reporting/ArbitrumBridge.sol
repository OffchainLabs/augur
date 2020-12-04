pragma solidity 0.5.15;
pragma experimental ABIEncoderV2;

import 'ROOT/sidechain/interfaces/IAugurPushBridge.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/sidechain/interfaces/IGlobalInbox.sol';

contract ArbitrumBridge {

    IAugurPushBridge private augurPushBridge;

    struct ArbChainData {
        address inboxAddress;
        address marketGetterAddress;
        bool exists;
    }

    mapping(address => ArbChainData ) private arbChainsRegistry;

    constructor(address _pushBridgeAddress) public {
        augurPushBridge = IAugurPushBridge(_pushBridgeAddress);
    }

    function registerArbchain(address arbChainAddress, address inboxAddress, address marketGetterAddress) external returns(bool) {
        // TODO: permission: only owner?
        arbChainsRegistry[arbChainAddress] = ArbChainData({
            inboxAddress: inboxAddress,
            marketGetterAddress: marketGetterAddress,
            exists: true
        });
        return true;
    }


    function pushBridgeData (address marketAddress, address arbChainAddress) external returns(bool){
        ArbChainData memory arbChainData = arbChainsRegistry[arbChainAddress];
        require(arbChainData.exists, "Arbchain not registered");

        IMarket market = IMarket(marketAddress);
        IAugurPushBridge.MarketData memory marketData = augurPushBridge.bridgeMarket(market);
        marketData.marketAddress = marketAddress;
        bytes memory marketDataPayload = abi.encodeWithSignature("receiveMarketData(bytes)", marketData);
        // todo: gas limit
        bytes memory l2MessagePayload = abi.encode(1000000, 0, arbChainData.marketGetterAddress, 0, marketDataPayload);
        IGlobalInbox(arbChainData.inboxAddress).sendL2Message(arbChainAddress, l2MessagePayload);
        return true;
    }

    function pushFeeData (address universeAddress, address arbChainAddress) external returns(bool){
        ArbChainData memory arbChainData = arbChainsRegistry[arbChainAddress];
        require(arbChainData.exists, "Arbchain not registered");

        IUniverse universe = IUniverse(universeAddress);
        uint256 fee = augurPushBridge.bridgeReportingFee(universe);
        bytes memory feeData = abi.encodeWithSignature("receiveFeeData(bytes)", fee);
        // todo: gas limit
        bytes memory l2MessagePayload = abi.encode(1000000, 0, arbChainData.marketGetterAddress, 0, feeData);
        IGlobalInbox(arbChainData.inboxAddress).sendL2Message(arbChainAddress,l2MessagePayload);
        return true;
    }


}