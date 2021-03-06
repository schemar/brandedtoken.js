'use strict';

const Mosaic = require('@openstfoundation/mosaic.js');
const GatewayComposer = require('../ContractInteract/GatewayComposer');

/**
 * Staker performs below tasks:
 * - approves GatewayComposer for ValueToken
 * - calls GatewayComposer.requestStake
 */
class Staker {
  /**
   * Staker constructor object.
   *
   * @param originWeb3 Origin chain web3 address.
   * @param valueToken Value token contract address.
   * @param brandedToken Branded Token contract address.
   * @param gatewayComposer Gateway composer contract address.
   */
  constructor(originWeb3, valueToken, brandedToken, gatewayComposer) {
    this.originWeb3 = originWeb3;
    this.valueToken = valueToken;
    this.brandedToken = brandedToken;
    this.gatewayComposerAddress = gatewayComposer;

    this.valueToken = new Mosaic.ContractInteract.EIP20Token(originWeb3, valueToken);
    this.gatewayComposer = new GatewayComposer(originWeb3, gatewayComposer);
  }

  /**
   * Staker performs below tasks:
   * - approves GatewayComposer for ValueToken
   * - calls GatewayComposer.requestStake
   *
   * @param stakeVTAmountInWei ValueToken amount which is staked.
   * @param mintBTAmountInWei Amount of BT amount which will be minted.
   * @param gatewayAddress Gateway contract address.
   * @param gasPrice Gas price that staker is ready to pay to get the stake
   *                  and mint process done.
   * @param gasLimit Gas limit that staker is ready to pay.
   * @param beneficiary The address in the auxiliary chain where the utility
   *                     tokens will be minted.
   * @param stakerGatewayNonce Nonce of the staker address stored in Gateway.
   * @param txOptions - Tx options.
   */
  async requestStake(
    stakeVTAmountInWei,
    mintBTAmountInWei,
    gatewayAddress,
    gasPrice,
    gasLimit,
    beneficiary,
    stakerGatewayNonce,
    txOptions,
  ) {
    const approveForValueTokenReceipt = await this.valueToken.approve(
      this.gatewayComposerAddress,
      stakeVTAmountInWei,
      txOptions,
    );
    let receipts = {
      approveForValueTokenReceipt,
    };

    if (!approveForValueTokenReceipt.status) {
      const err = new Error(
        `Approval for value token is failed with transactionHash: ${approveForValueTokenReceipt.transactionHash}`,
      );
      return Promise.reject(err);
    }

    console.log('approveForValueToken status:', approveForValueTokenReceipt.status);

    const requestStakeReceipt = await this.gatewayComposer.requestStake(
      stakeVTAmountInWei,
      mintBTAmountInWei,
      gatewayAddress,
      beneficiary,
      gasPrice,
      gasLimit,
      stakerGatewayNonce,
      txOptions,
    );

    if (!requestStakeReceipt.status) {
      const err = new Error(
        `Request stake is failed with transactionHash: ${requestStakeReceipt.transactionHash}`,
      );
      return Promise.reject(err);
    }

    receipts = {
      requestStakeReceipt,
      ...receipts,
    };

    console.log('requestStake status:', requestStakeReceipt.status);
    return receipts;
  }
}

module.exports = Staker;
