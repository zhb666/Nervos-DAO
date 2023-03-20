## 本地节点交互

大多数情况下，使用默认配置即可进行开发。但是在某些情况下，为了快速获得结果，可能需要加速某些操作。在本指南中，我们将介绍如何调整配置以在本地测试DAO提款流程并快速跳过纪元。

### 1. 首先，根据文档运行本地完整节点  - [运行 CKB 开发区块链](https://docs.nervos.org/docs/basics/guides/devchain/#4-adjust-the-parameters-to-shorten-the-block-interval-optional)

### 2. 调整参数以缩短块间隔

#### 2a. 更改一个纪元中的块数
默认的纪元长度为1000块。将其减少到10或100可帮助测试 Nervos DAO 操作。

在 `specs/dev.toml` 文件的 `params` 部分中修改 `genesis_epoch_length` 参数：

```ts
[params]
genesis_epoch_length = 1000  # The unit of meansurement is "block".
```

#### 2b.使用永久难度
当 `permanent_difficulty_in_dummy` 设置为 true 时，所有纪元将使用与创世纪纪元长度相同的长度，完全跳过难度调整。此参数通常与 `genesis_epoch_length` 结合使用。

在 `specs/dev.toml` 文件的 params 部分中修改 `permanent_difficulty_in_dummy` 参数：

```ts
[params]
genesis_epoch_length = 10
permanent_difficulty_in_dummy = true
```

#### 2c. 更改挖掘间隔
默认的挖掘间隔为5000，它是毫秒值，即5秒。将此值减小将会更快地创建块。

在 `ckb-miner.toml` 文件的 `miner.workers` 部分中修改 `value` 参数：


```toml
[[miner.workers]]
worker_type = "Dummy"
delay_type = "Constant"
value = 5000  # 单位是 "ms"。
```

## 3.运行 CKB 节点，运行以下命令：
```ts
ckb run
```

### 4.下载 Nexus 钱包 
下载 [Nexus](https://github.com/ckb-js/nexus) 钱包，并按照流程登录钱包。

### 5.运行 Nervos-Dao 项目
```ts
 npm run i
 npm run start
 npm run build
```
将 Nervos-Dao 连接到钱包。

#### 5a.查找钱包地址
打开浏览器控制台查找钱包锁。请参阅 [Change lock to address](https://lumos-website.vercel.app/tools/address-conversion)

#### 5b.转账到钱包
在终端中运行以下命令：
```sh
 ./ckb-cli Execute wallet transfer --from-account "You miner address" --to-address "You wallet address" --capacity 10000 --max-tx-fee 0.00001
 ```
 或者更改 ```specs/dev.toml```下
 
```toml
[[genesis.issued_cells]]
capacity = 20_000_000_000_00000000
lock.code_hash = "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8"
lock.args = "你的lock"
lock.hash_type = "type"
```


### 6.更改钱包网络节点

请注意，您需要更改钱包网络配置以指向本地节点

还需要更改 Nervos-Dao  `src/config`
```ts
const TEST_CKB_RPC_URL = "http://localhost:8114";
const TEST_CKB_INDEXER_URL = "http://localhost:8114";
``` 


#### 6.a 使用 Dapp 检查转账是否成功
转账成功后，Dapp 会有余额展示 

### 7. 由于本地节点合约部署地址不同，因此需要注意替换 cellDeps。
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
创世区块的第 0 个交易的第 0x2(index) 个 cell 输出是 Dao 的 cell。或者执行

```ts
./ckb list-hashes 
```
搜索

```ts
[[ckb_dev.system_cells]]
path = "Bundled(specs/cells/dao)"
```
如果使用 type_hash，则与 mainnet/testnet 的输出索引和哈希相同。

#### 7.a 还需要替换 depGroup 中的 outPoint.txHash
[参考这段代码](https://github.com/ckb-js/ckit/blob/develop/packages/ckit/src/__tests__/deploy.ts#L27-L47)

后续是正常发送交易并验证 Dao。

### 8. [具体资料可以参考](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md)

