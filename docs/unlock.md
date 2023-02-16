## Nervos-Dao unlock

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
