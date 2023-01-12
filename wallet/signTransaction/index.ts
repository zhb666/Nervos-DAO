import { sealTransaction, TransactionSkeletonType } from "@ckb-lumos/helpers";
import { commons, hd, Transaction } from "@ckb-lumos/lumos";
import { RPC_NETWORK } from "../../config";

export async function signTransaction(
  txSkeleton: TransactionSkeletonType,
  privateKeys: string[]
): Promise<Transaction> {
  const txSkeletonWEntries = commons.common.prepareSigningEntries(txSkeleton, {
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
