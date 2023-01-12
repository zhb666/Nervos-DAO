import { sealTransaction, TransactionSkeletonType,LiveCellFetcher,createTransactionSkeleton } from "@ckb-lumos/helpers";
import { commons, hd, OutPoint, Transaction } from "@ckb-lumos/lumos";
import { RPC_NETWORK ,privateKey} from "../../config";
const txSkeleton = require("../../mock/txSkeleton.json");

export async function signTransaction(
  transaction: Transaction,
): Promise<Transaction> {
  const txSkeletonObject: TransactionSkeletonType = txSkeleton
  const privateKeys: string[] = [privateKey]

  const mockFetcher: LiveCellFetcher = (outPoint) =>
    txSkeletonObject.inputs.find(
      (input) =>
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

  const signatures = [];
  for (let i = 0; i < privateKeys.length; i += 1) {
    const entry = txSkeletonWEntries.get("signingEntries").get(i);
    // @ts-ignore
    signatures.push(hd.key.signRecoverable(entry.message, privateKeys[i]));
  }
  const tx = sealTransaction(txSkeletonWEntries, signatures);

  return tx
}
