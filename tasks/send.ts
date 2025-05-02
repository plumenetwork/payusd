import {task} from 'hardhat/config';
import {getNetworkNameForEid, types} from '@layerzerolabs/devtools-evm-hardhat';
import {EndpointId} from '@layerzerolabs/lz-definitions';
import {addressToBytes32} from '@layerzerolabs/lz-v2-utilities';
import {Options} from '@layerzerolabs/lz-v2-utilities';
import {BigNumberish, BytesLike} from 'ethers';

interface Args {
  amount: string;
  to: string;
  toEid: EndpointId;
  contract: string;
}

interface SendParam {
  dstEid: EndpointId; // Destination endpoint ID, represented as a number.
  to: BytesLike; // Recipient address, represented as bytes.
  amountLD: BigNumberish; // Amount to send in local decimals.
  minAmountLD: BigNumberish; // Minimum amount to send in local decimals.
  extraOptions: BytesLike; // Additional options supplied by the caller to be used in the LayerZero message.
  composeMsg: BytesLike; // The composed message for the send() operation.
  oftCmd: BytesLike; // The OFT command to be executed, unused in default OFT implementations.
}

// send tokens from a contract on one network to another
task('lz:oft:send', 'Sends tokens from either OFT or OFTAdapter')
  .addParam('to', 'contract address on network B', undefined, types.string)
  .addParam('toEid', 'destination endpoint ID', undefined, types.eid)
  .addParam('amount', 'amount to transfer in token decimals', undefined, types.string)
  .addParam('contract', 'contract name', undefined, types.string)
  .setAction(async (taskArgs: Args, {ethers, deployments}) => {
    const toAddress = taskArgs.to;
    const eidB = taskArgs.toEid;
    const amount = taskArgs.amount;

    const oftDeployment = await deployments.get(taskArgs.contract);

    const [signer] = await ethers.getSigners();

    const oftContract = new ethers.Contract(oftDeployment.address, oftDeployment.abi, signer);
    const innerTokenAddress = await oftContract.token();

    const ERC20Factory = await ethers.getContractAt('IERC20', innerTokenAddress);

    // If the token address !== address(this), then this is an OFT Adapter
    const isAdapter = innerTokenAddress !== oftContract.address;

    let options = Options.newOptions().toBytes();

    // Now you can interact with the correct contract
    const oft = oftContract;

    const sendParam: SendParam = {
      dstEid: eidB,
      to: addressToBytes32(toAddress),
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: options,
      composeMsg: ethers.utils.arrayify('0x'), // Assuming no composed message
      oftCmd: ethers.utils.arrayify('0x'), // Assuming no OFT command is needed
    };
    // Get the quote for the send operation
    const feeQuote = await oft.quoteSend(sendParam, false);
    const nativeFee = feeQuote.nativeFee;

    console.log(
      `sending ${taskArgs.amount} token(s) to network ${getNetworkNameForEid(eidB)} (${eidB})`,
    );

    if (isAdapter) {
        // If the contract is OFT Adapter, get decimals from the inner token
        const innerToken = ERC20Factory.attach(innerTokenAddress);

        // Check current allowance
        const currentAllowance = await innerToken.allowance(signer.address, oftDeployment.address);
        
        // If allowance not enough, approve the amount
        if (currentAllowance.lt(amount)) {
            console.log(`Approving ${amount} tokens to be spent by the OFT adapter...`);
            const approveTx = await innerToken.approve(oftDeployment.address, amount);
            await approveTx.wait();
            console.log('Approval complete');
        }
    }

    const r = await oft.send(sendParam, {nativeFee: nativeFee, lzTokenFee: 0}, signer.address, {
      value: nativeFee,
    });
    console.log(`Send tx initiated. See: https://layerzeroscan.com/tx/${r.hash}`);
  });