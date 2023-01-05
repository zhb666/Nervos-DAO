## Nervos-DAO

1.会先搭建一套Dao的页面

2.验证一下window里面是否有注入的ckb对象
```js
const getCKB = () =>
  new Promise((resolve, reject) => {
    // 页面加载完成
    window.addEventListener("load", async () => {
      if (window.ckb) {
        const CKB = new ckb();
        try {
          resolve(CKB);
        } catch (error) {
          reject(error);
        }
      }
      else {
        alert("请安装nexus钱包")
      }
    });
  });
export default {
	getCKB
}; 

```

3.如果有注入就可以验证授权关联
```ts
const CKB = require("../wallet/getCKB");

let CkbProvider;
CKB.enable().then((res:CkbProvider) => {
    // 关联后获取CkbProvider
    CkbProvider = res
})}
```

4.获取金额
```ts

interface ScriptObject {
  code_hash: string;
  hash_type: string;
  args: string;
}

// 获取金额
async function capacityOf(): Promise<BI> {
  let balance = BI.from(0);

  let cells = await CkbProvider.bip44.getLiveCells();

  for (const cell of cells.objects) {
    balance = balance.add(cell.cell_output.capacity);
  }
  return balance;
}

// 获取未使用Script
export async function getUnusedLocks(
  cursor?: string
) {
  let unUsedLocks:ScriptObject = await CkbProvider.bip44.getUnusedLocks({cursor});
  return unUsedLocks
}
```

5.Dao需要和插件交互的话需要调用ckb注入的对象的方法去质押然后等待返回结果，这个时候页面会有一个等待的过程。
```ts
import { sealTransaction } from "@ckb-lumos/helpers";
import { config } from "@ckb-lumos/lumos";
const { AGGRON4, LINA } = config.predefined;

export enum FeeRate {
  SLOW = 1000,
  NORMAL = 100000,
  FAST = 10000000
}

const NETWORK = await CkbProvider.getNetworkName()

let NETWORKHTTP = NETWORK == "ckb" ? "https://mainnet.ckb.dev/" : "https://testnet.ckb.dev/"

let RPC_NETWORK = NETWORK == "ckb" ? LINA : AGGRON4

async function deposit(
  amount: bigint,
  from: string,
  feeRate: FeeRate.SLOW
): Promise<string> {
  if (amount < DAOCELLSIZE) {
    throw new Error("Minimum deposit value is 102 CKB");
  }

  let rawTx = getTransactionSkeleton();

  rawTx = await dao.deposit(tx, from, to, amount, {
    config: RPC_NETWORK
  });

  // 动态计算最小矿工费
  rawTx = await common.payFeeByFeeRate(
    tx,
    [from],
    feeRate,
    undefined,
    { config: RPC_NETWORK }
  );


  const currentSignature = await CkbProvider.bip44.signTransaction({rawTx});
  signature.push(currentSignature)

  const tx = sealTransaction(tx,signature);

  const hash = await sendTransaction(tx);

  return hash;
}

async function sendTransaction(tx: Transaction) {
  const hash = await send_Transaction(tx);
  return hash;
}


const txhash = await deposit(BigInt(amount * 10 ** 8),unUsedLocks);

// 得到交易结果
if (txhash) {
    // 页面弹窗告知用户
	openNotificationWithIcon("success")
    // 关闭等待弹窗
	setLoading(false)
}

```

6.成功或者失败之后需要重新请求ckb注入的方法获取最新的金额，交易，然后更新页面

```js
const balance = await capacityOf();
const usedLocks = await getUsedLocks();
```


