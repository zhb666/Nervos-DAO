## Nervos-DAO

1. Will first build a set of Dao pages

2. Verify whether there is an injected ckb object in the window
```js
const getCKB = () =>
  new Promise((resolve, reject) => {
    // page loaded
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
        alert("Please install the nexus wallet")
      }
    });
  });
export default {
	getCKB
}; 

```

3.Authorization association can be verified if injected
```ts
const CKB = require("../wallet/getCKB");

let CkbProvider;
CKB.enable().then((res:CkbProvider) => {
    // 关联后获取CkbProvider
    CkbProvider = res
})}
```

4.get the amount
```ts

interface ScriptObject {
  code_hash: string;
  hash_type: string;
  args: string;
}

async function capacityOf(): Promise<BI> {
  let balance = BI.from(0);

  let cells = await CkbProvider.bip44.getLiveCells();

  for (const cell of cells.objects) {
    balance = balance.add(cell.cell_output.capacity);
  }
  return balance;
}

// Get unused script
export async function getOffChainLocks(
  cursor?: string
) {
  let unUsedLocks:ScriptObject = await CkbProvider.bip44.getOffChainLocks({cursor});
  return unUsedLocks
}
```

5. If Dao needs to interact with the plug-in, it needs to call the method of the object injected by ckb to pledge and wait for the result to be returned. At this time, the page will have a waiting process.
```ts
import { sealTransaction } from "@ckb-lumos/helpers";
import { config, commons, hd } from "@ckb-lumos/lumos";
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

  rawTx = await dao.deposit(rawTx, from, to, amount, {
    config: RPC_NETWORK
  });

  // Dynamically calculate the minimum miner fee
  rawTx = await common.payFeeByFeeRate(
    tx,
    [from],
    feeRate,
    undefined,
    { config: RPC_NETWORK }
  );

  const signatures = [];
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

// get transaction result
if (txhash) {
    // Page pop-up window informs the user
	openNotificationWithIcon("success")
    // Close the waiting popup
	setLoading(false)
}

```

6.After success or failure, you need to re-request the ckb injection method to get the latest amount, transaction, and then update the page

```js
const balance = await capacityOf();
const usedLocks = await getUsedLocks();
```


