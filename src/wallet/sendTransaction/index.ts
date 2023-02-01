import { Transaction } from "@ckb-lumos/lumos";
import { HTTPRPC } from '../../config';


async function sendTransaction(tx: Transaction) {
  const hash = await HTTPRPC.sendTransaction(tx, "passthrough");
  console.log("hash: "+hash);
  return hash;
}

export { sendTransaction };
