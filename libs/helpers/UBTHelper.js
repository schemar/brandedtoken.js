'use strict';

const AbiBinProvider = require('../../libs/AbiBinProvider');

const ContractName = 'UtilityBrandedToken';
const DEFAULT_DECIMALS = 18;

// TODO Documentation
class UBTHelper {
  constructor(web3, address) {
    const oThis = this;
    oThis.web3 = web3;
    oThis.address = address;
    oThis.abiBinProvider = new AbiBinProvider();
  }

  /*
    Supported Configurations for setup
    {
      deployer: config.deployerAddress,
      token: brandedTokenContractAddress,
      symbol: "BT",
      name: "MyBrandedToken",
      decimals: "18",
      organization: '0x...'
    }
    All configurations are mandatory.
*/

  setup(config, txOptions, web3) {
    const oThis = this;
    web3 = web3 || oThis.web3;

    //valueToken
    if (!config.token) {
      throw new Error('Mandatory configuration "token" missing. Set config.token address');
    }

    //Organization
    if (!config.organization) {
      throw new Error('Mandatory configuration "organization" missing. Set config.organization address.');
    }

    UBTHelper.validateSetupConfig(config);

    if (!txOptions) {
      txOptions = txOptions || {};
    }
    txOptions.gasPrice = 0;

    let deployParams = Object.assign({}, txOptions);
    deployParams.from = config.deployer;
    deployParams.gasPrice = 0;

    //1. Deploy the Contract
    let promiseChain = oThis.deploy(
      config.token,
      config.symbol,
      config.name,
      config.decimals,
      config.organization,
      deployParams
    );

    return promiseChain;
  }

  static validateSetupConfig(config) {
    console.log(`* Validating ${ContractName} Setup Config.`);
    if (!config) {
      throw new Error('Mandatory parameter "config" missing. ');
    }

    if (!config.deployer) {
      throw new Error('Mandatory configuration "deployer" missing. Set config.deployer address');
    }

    //symbol
    if (!config.symbol) {
      throw new Error('Mandatory configuration "symbol" missing. Set config.symbol address');
    }

    //symbol
    if (!config.name) {
      throw new Error('Mandatory configuration "name" missing. Set config.name address');
    }

    //decimals
    if (!config.decimals) {
      config.decimals = DEFAULT_DECIMALS;
    }

    return true;
  }

  deploy(_token, _symbol, _name, _decimals, _organization, txOptions, web3) {
    const oThis = this;
    web3 = web3 || oThis.web3;
    _decimals = _decimals || DEFAULT_DECIMALS;

    const abiBinProvider = oThis.abiBinProvider;
    const abi = abiBinProvider.getABI(ContractName);
    const bin = abiBinProvider.getBIN(ContractName);

    let defaultOptions = {
      gas: '8000000'
    };

    if (txOptions) {
      Object.assign(defaultOptions, txOptions);
    }
    txOptions = defaultOptions;

    let args = [_token, _symbol, _name, _decimals, _organization];

    const contract = new web3.eth.Contract(abi, null, txOptions);
    let tx = contract.deploy(
      {
        data: bin,
        arguments: args
      },
      txOptions
    );

    console.log(`* Deploying ${ContractName} Contract`);
    let txReceipt;
    return tx
      .send(txOptions)
      .on('transactionHash', function(transactionHash) {
        console.log('\t - transaction hash:', transactionHash);
      })
      .on('error', function(error) {
        console.log('\t !! Error !!', error, '\n\t !! ERROR !!\n');
        return Promise.reject(error);
      })
      .on('receipt', function(receipt) {
        txReceipt = receipt;
        console.log('\t - Receipt:\n\x1b[2m', JSON.stringify(receipt), '\x1b[0m\n');
      })
      .then(function(instace) {
        oThis.address = instace.options.address;
        console.log(`\t - ${ContractName} Contract Address:`, oThis.address);
        return txReceipt;
      });
  }

  setCoGateway(cogateway, txOptions, contractAddress, web3) {
    const oThis = this;
    web3 = web3 || oThis.web3;
    contractAddress = contractAddress || oThis.address;

    let defaultOptions = {
      gas: '60000',
      gasPrice: '0x5B9ACA00'
    };

    if (txOptions) {
      Object.assign(defaultOptions, txOptions);
    }
    txOptions = defaultOptions;

    const abiBinProvider = oThis.abiBinProvider;
    const abi = abiBinProvider.getABI(ContractName);
    const contract = new web3.eth.Contract(abi, contractAddress, txOptions);
    let tx = contract.methods.setCoGateway(cogateway);

    console.log(`* setCoGateway on ${ContractName}`);
    return tx
      .send(txOptions)
      .on('transactionHash', function(transactionHash) {
        console.log('\t - transaction hash:', transactionHash);
      })
      .on('receipt', function(receipt) {
        console.log('\t - Receipt:\n\x1b[2m', JSON.stringify(receipt), '\x1b[0m\n');
      })
      .on('error', function(error) {
        console.log('\t !! Error !!', error, '\n\t !! ERROR !!\n');
        return Promise.reject(error);
      });
  }

  registerInternalActor(internalActors, txOptions, contractAddress, web3) {
    const oThis = this;
    web3 = web3 || oThis.web3;
    contractAddress = contractAddress || oThis.address;

    let defaultOptions = {
      gas: '60000',
      gasPrice: '0x5B9ACA00'
    };

    if (txOptions) {
      Object.assign(defaultOptions, txOptions);
    }
    txOptions = defaultOptions;

    const abiBinProvider = oThis.abiBinProvider;
    const abi = abiBinProvider.getABI(ContractName);
    const contract = new web3.eth.Contract(abi, contractAddress, txOptions);
    let tx = contract.methods.registerInternalActor(internalActors);
    let txReceipt;
    console.log(`* registerInternalActor on ${ContractName}`);

    return tx
      .send(txOptions)
      .on('transactionHash', function(transaction) {
        console.log('\t - transaction hash:', transaction);
      })
      .on('receipt', function(receipt) {
        console.log('test test 3');
        txReceipt = receipt;
        console.log('\t - Receipt:\n\x1b[2m', JSON.stringify(txReceipt), '\x1b[0m\n');
      })
      .on('error', function(error) {
        console.log('\t !! Error !!', error, '\n\t !! ERROR !!\n');
        return Promise.reject(error);
      });
  }

  static get DEFAULT_DECIMALS() {
    return DEFAULT_DECIMALS;
  }
}

module.exports = UBTHelper;
