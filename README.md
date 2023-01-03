## Nervos-DAO

1.会先搭建一套Dao的页面

2.验证一下window里面是否有注入的ckb对象
```js
const getCKB = () =>
  new Promise((resolve, reject) => {
    // 页面加载完成
    window.addEventListener("load", async () => {
      if (window.ckb) {
        const provider = "http://127.0.0.1:9545";
        const CKB = new ckb(provider || 'ckb_testnet');
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
```js
const CKB = require("../wallet/getCKB");
CKB.enable().then((res) => {
    // 关联后获取账号信息，比如账号地址
    const lockScript = res
})}
```

4.获取金额，交易数据
```ts
interface ScriptObject {
  code_hash: string;
  hash_type: string;
  args: string;
}

// 获取金额
async function capacityOf(lockScript: ScriptObject): Promise<BI> {
  let balance = BI.from(0);

  let cells = await CKB.getCells(lockScript);

  for await (const cell of cells.objects) {
    balance = balance.add(cell.cell_output.capacity);
  }
  return balance;
}

// 获取交易数据
export async function getTransactions(
  script: ScriptObject,
  lastCursor?: string
) {
  let transactions = await CKB.getTransactions(lockScript);
  return transactions
}
```

5.Dao需要和插件交互的话需要调用ckb注入的对象的方法去质押然后等待返回结果，这个时候页面会有一个等待的过程。
```ts
const txhash = await CKB.deposit(BigInt(amount * 10 ** 8));

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
const balance = await capacityOf(lockScript);
const transactions = await getTransactions(lockScript);

```


