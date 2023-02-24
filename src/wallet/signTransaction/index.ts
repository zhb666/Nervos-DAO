import { sealTransaction,TransactionSkeletonType,LiveCellFetcher,createTransactionSkeleton } from "@ckb-lumos/helpers";
import { commons, hd, OutPoint, Script, Transaction } from "@ckb-lumos/lumos";
import { log } from 'console';
import { RPC_NETWORK ,privateKey} from "../../config";
import owership from '../../owership';
import { GroupedSignature, Signature } from '../../type';
// const txSkeleton = require("../../mock/txSkeleton.json");


export async function signTransaction(
  transaction: Transaction,
): Promise<GroupedSignature> {
  // @ts-ignore
  const txSkeleton:TransactionSkeletonType = JSON.parse(window.localStorage.getItem('txSkeleton'))
  const txSkeletonObject: TransactionSkeletonType = txSkeleton
  const privateKeys: string[] = [privateKey]
  const script = await owership.getOffChainLocks()

  // @ts-ignore
  const mockFetcher: LiveCellFetcher = (outPoint: { txHash: string; index: any; }) =>
    txSkeletonObject.inputs.find(
  // @ts-ignore
      (input: { outPoint: { txHash: string; index: string; }; }) =>
        input.outPoint?.txHash === outPoint.txHash &&
        input.outPoint?.index === outPoint.index
    ) ?? {
      outPoint,
      cellOutput: {
        capacity: "0x",
        lock: {
          codeHash: "0x",
          args: "0x",
          hashType: "type",
        },
      },
      data: "0x",
    };

  const checkedTxSkeleton = await createTransactionSkeleton(transaction, mockFetcher);

  const txSkeletonWEntries = commons.common.prepareSigningEntries(checkedTxSkeleton, {
    config: RPC_NETWORK
  });

  // Multiple wallets or a single wallet
  if (privateKeys.length !== txSkeletonWEntries.get("signingEntries").count()) {
    throw new Error("Invalid private keys length");
  }

  let signatures:Signature = "";
  // const signatures = [];
  for (let i = 0; i < privateKeys.length; i += 1) {
    const entry = txSkeletonWEntries.get("signingEntries").get(i);
    // @ts-ignore
    // signatures.push(hd.key.signRecoverable(entry.message, privateKeys[i]));
    signatures = (hd.key.signRecoverable(entry.message, privateKeys[i]));
  }

  return [[script,signatures]]
 
  // const tx = sealTransaction(txSkeletonWEntries, signatures);
  // return tx

}
