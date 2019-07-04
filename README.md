# Plasma MVP
This repositary is originally forked from [ethereum-plasma/plasma](https://github.com/ethereum-plasma/plasma)
## Prerequisite

1. [Truffle](http://truffleframework.com/): An Ethereum development framework which helps us compiling, deploying, and interacting with smart contract.
2. Testrpc: A test Ethereum RPC client for fast development. Here, we use GUI version of [ganache](http://truffleframework.com/ganache/). If you prefer a CLI version, you could replace it with [ganache-cli](https://github.com/trufflesuite/ganache-cli). Note that you could also launch an Ethereum private chain (geth) to replace testrpc.

## Run
1. Install dependency
```
npm install
```
2. Run ganache
```
Open up ganache and make sure it is running on port 8545.
```
3. Compile contracts
```
truffle compile
```
4. Deploy contracts
```
truffle migrate
```
If you need to deploy contracts on this testrpc again, don't forget to add the `--reset` argument.

5. Set the contract configuration (config.js).
    1. After deploying contracts, fill in the `PlasmaChainManager` contract address.
    2. Choose one of the initial addresses as the operator address, for example, `0x864546B848Fdc730D8aeaf39Bb8361cd7Ba69eF8`. Note, that this address will be used for submitting blockheader to contract and signing blocks.
6. Run the plasma chain.
```
npm start
```


## HTTP API

Import all API collection in Postman by clicking below button.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/1c7b783c9b9803ec66b4)

Or you can manually import this file into postman: [PlasmaAPI_collection.json](https://github.com)

##Introduction to API
### Get blockchain
Get the whole blockchain.
##### Parameter
None
##### Example

Send Request to http://localhost:3001/blocks
You will see response like this:
```json
[
    {
        "blockNumber": 0,
        "previousHash": "46182d20ccd7006058f3e801a1ff3de78b740b557bba686ced70f8e3d8a009a6",
        "merkleRoot": "",
        "signature": "",
        "transactions": []
    }
]
```
### Deposit
Deposit ethereum into plasma smart contract.
##### Parameter
|Name|Type|Required|Description|
|---|---|---|---|
|address|Address|Yes|Deposit from whom|
|amount|Integer|Yes|How much funds to deposit|
##### Example
You can set this parameter in postman. Let's deposit 1 ethereum from this address,
```json
{
	"address": "0xE6853BC43Dc06B996b0fFD4357Fccdb2fF6dbb6a", //Deposit from whom
	"amount": 1 //Amount of Ethereum
}
```
Now send request to http://localhost:30001/deposit

### Mine blocks
When plasma operator mines the block, you can use your deposited funds to transfer.
##### Parameter
None
##### Example

Send Request to http://localhost:3001/mineBlock
You will see response like this:

```json
{
    "blockNumber": 1,
    "previousHash": "69f42c447cce77346419d167becb3ff86228b7d45c86060ddab61537966b9d30",
    "merkleRoot": "f06679a87df852aa5f0a8be5939e183e368f0b2b89f9d2892ee696da6bf6a1fb",
    "signature": "c3bc169026c871b93de1ddb616487693dad1b587e41938b810d4a285bef2327150e73be4f15cf18c124395bc7ac6e1e9667f92bf33ec3c0e57ef4a28102098f21c",
    "transactions": [
        "e980808080808094e6853bc43dc06b996b0ffd4357fccdb2ff6dbb6a880de0b6b3a76400008080808080"
    ]
}
```
### UTXO
Once plasma operator mines the block, you can check your deposit. Your funds will be stored as UTXO.
##### Parameter
None
##### Example

Send Request to http://localhost:3001/utxo
You will see response like this:

```json
[
    {
        "blkNum": 1,
        "txIndex": 0,
        "oIndex": 0,
        "owner": "0xE6853BC43Dc06B996b0fFD4357Fccdb2fF6dbb6a",
        "denom": 100000000000000000
    }
]
```

### Create a transaction
Create a transaction to other participants. User could specify at most two UTXOs to spend. Also note that the units used in field `amount` is ether.
##### Parameter
|Name|Type|Required|Description|
|---|---|---|---|
|from|Address|Yes|Transfer funds from whom|
|to|Address|Yes|Transfer funds to whom|
|amount|Decimal|Yes|How much ether (in ether)|
##### Example
Set below parameter in postman to transfer 0.1 etherum to other account:
```json
{
	"from": "0xE6853BC43Dc06B996b0fFD4357Fccdb2fF6dbb6a",
	"to": "0x6D80E168305fcA47569df7fCac42d5B3C8C2C2E7",
	"amount": 0.1
}
```
Then send request to http://localhost:3001/transact.
### Transaction Pool
From pool, you can check pending transaction which is not submitted to plasma contract.
##### Parameter
None
##### Example

Send Request to http://localhost:3001/pool
You will see response like this if there is any pending transactions:

```json
[
    {
        "blkNum1": 1,
        "txIndex1": 0,
        "oIndex1": 0,
        "sig1": "0xbff065edf6fb8f229323997119a5774b179b0f49353ed234d294df72d18482b952df3e4f1e363fa442a90c8519d3948017d833331c467f21858ae5220920d03300",
        "blkNum2": 0,
        "txIndex2": 0,
        "oIndex2": 0,
        "sig2": 0,
        "newOwner1": "0xCfEFF569424928eD111c850174912617B1519C67",
        "denom1": 100000000000000000,
        "newOwner2": "0xE6853BC43Dc06B996b0fFD4357Fccdb2fF6dbb6a",
        "denom2": 900000000000000000,
        "fee": 0,
        "type": 0
    }
]
```
Once plasma operator mines the block, transactions will be removed from pool and utxo will be updated of both account. You can check it out by sending request to http://localhost:3001/utxo after block is mined.


### Create withdrawal
Create a new withdrawal.
##### Parameter
|Name|Type|Required|Description|
|---|---|---|---|
|blkNum|Integer|Yes|The position of the UTXO user wants to withdraw|
|txIndex|Integer|Yes|The position of the UTXO user wants to withdraw|
|oIndex|Integer|Yes|The position of the UTXO user wants to withdraw|
|from|Address|Yes|The owner of the UTXO|
##### Example
Submit your utxo with merkle proof to withdraw funds.
```json
{
	"blkNum": 2,
	"txIndex": 0,
	"oIndex": 1,
	"from": "0xE6853BC43Dc06B996b0fFD4357Fccdb2fF6dbb6a"
}
```
Then submit request to http://localhost:3001/withdraw/create.
You will receive withdrawalId in responce. Mine is `2000001`


### Challenge withdrawal
Create a withdrawal challenge.
##### Parameter
|Name|Type|Required|Description|
|---|---|---|---|
|withdrawalId|Integer|Yes|The withdrawal ID user wants to challenge|
|blkNum|Integer|Yes|The position of the UTXO user wants to challenge|
|txIndex|Integer|Yes|The position of the UTXO user wants to challenge|
|oIndex|Integer|Yes|The position of the UTXO user wants to challenge|
|from|Address|Yes|The owner of the UTXO|
##### Example
You need to send utxo with mercle proof along with withdrawalId to challenge withdraw.
```json
{
	"withdrawalId": 2000001,
	"blkNum": 2,
	"txIndex": 0,
	"oIndex": 1,
	"from": "0x6C7f749d0E21aA6478aF8e7Adc362a8bF76Be826"
}
```
Then submit request to http://localhost:3001/withdraw/challenge
#### Finalize withdrawal
Finalize withdrawals manually.
##### Parameter
|Name|Type|Required|Description|
|---|---|---|---|
|from|Address|Yes|Who initiates the withdrawal finalization|
##### Sample
```json
{
	"from": "0xE6853BC43Dc06B996b0fFD4357Fccdb2fF6dbb6a"
}
```
Then submit request to http://localhost:3001/withdraw/finalize