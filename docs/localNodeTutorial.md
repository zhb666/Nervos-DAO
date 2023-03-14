## Nervos-Dao 

For most development, the default configuration should be sufficient, but sometimes it is beneficial to speed up certain operations so that results can be seen quickly.

The last step of DAO withdrawal needs to be tested locally in order to quickly skip epoch

Need to follow the following steps

### 1. Need to run local full node according to the documentation - [Run a CKB Dev Blockchain](https://docs.nervos.org/docs/basics/guides/devchain/#4-adjust-the-parameters-to-shorten-the-block-interval-optional)

### 2. Adjust the Parameters to Shorten the Block Interval

#### 2a. Change the Number of Blocks in an Epoch
The default epoch length is 1000 blocks. Reducing this to 10 or 100 can help with testin Nervos DAO operations.

Modify the genesis_epoch_length parameter in the specs/dev.toml file under the params section:

```ts
[params]
genesis_epoch_length = 1000  # The unit of meansurement is "block".
```

#### 2b. Use Permanent Difficulty
When permanent_difficulty_in_dummy is set to true, all epochs will use the same length as the genesis epoch length, skipping the difficulty adjustment entirely. This param is typically used in conjunction with genesis_epoch_length.

Modify the permanent_difficulty_in_dummy parameter in the specs/dev.toml file under the params section:

```ts
[params]
genesis_epoch_length = 10
permanent_difficulty_in_dummy = true
```

#### 2c. Change the Mining Interval
The default mining interval is 5000, which is a value in milliseconds, meaning 5 seconds. Reducing this value will create blocks faster.

Modify the value parameter in the ckb-miner.toml file under the miner.workers section:

```ts
[[miner.workers]]
worker_type = "Dummy"
delay_type = "Constant"
value = 5000  # The unit of measurement is "ms".
```

## 3.Start the CKB Node
```ts
ckb run
```

### 4.Download Nexus Wallet [Download Nexus Wallet](https://github.com/ckb-js/nexus)
Follow the process to log in to the wallet

### 5.Run the Nervos-Dao project
```ts
 npm run i
 npm run start
 npm run build
```
Nervos-Dao connected wallet

#### 5a.find wallet address
Open the browser console to find the wallet lock
[Change lock to address](https://lumos-website.vercel.app/tools/address-conversion)

#### 5b.transfer to wallet
Open the terminal and run ./ckb-cli Execute wallet transfer --from-account "You miner address" --to-address "You wallet address" --capacity 10000 --max-tx-fee 0.00001


### 6.Change the wallet network node
Note that you need to change the wallet network configuration to point to the local node

#### 6.a Use Dapp to check whether the transfer is success
After the transfer is successful, the Dao operation can be followed

### 7. Because the local node contract deployment addresses are different. So you need to pay attention to replace cellDeps
```ts
echo '{
    "id": 2,
    "jsonrpc": "2.0",
    "method": "get_block_by_number",
    "params": [
        "0x0"
    ]
}' \
| tr -d '\n' \
| curl -H 'content-type: application/json' -d @- \
http://localhost:8114
```
The 0x2(index) cell output of the 0th transaction of the genesis block is Dao's cell. or Execute
 
```ts
./ckb list-hashes 
```
turn up

```ts
[[ckb_dev.system_cells]]
path = "Bundled(specs/cells/dao)"
```
If you use type_hash, it is the same output index and hash as the mainnet/testnet

#### 7.a Also need to replace outPoint.txHash in depGroup
[Refer to this string of code](https://github.com/ckb-js/ckit/blob/develop/packages/ckit/src/__tests__/deploy.ts#L27-L47)

The follow-up is to send the transaction verification Dao normally

[Nervos-Dao rfcs Detailed reference](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md)

