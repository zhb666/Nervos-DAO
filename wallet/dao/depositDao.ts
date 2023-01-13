import { dao, common } from "@ckb-lumos/common-scripts";
import { createTransactionFromSkeleton ,sealTransaction} from "@ckb-lumos/helpers";
import { DAOCELLSIZE, RPC_NETWORK,address } from "../../config";
import { FeeRate } from "../../type";
import { getTransactionSkeleton } from "../customCellProvider";
import owership from '../../owership';
import { sendTransaction } from '../sendTransaction';
import { json } from 'stream/consumers';
import { commons } from '@ckb-lumos/lumos';

export async function deposit(
  amount: bigint,
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {
  if (amount < DAOCELLSIZE) {
    throw new Error("Minimum deposit value is 102 CKB");
  }

  const from = address
  const to = address

  let txSkeleton = getTransactionSkeleton(await owership.getUnusedLocks());

  txSkeleton = await dao.deposit(txSkeleton, from, to, amount, {
    config: RPC_NETWORK
  });

  txSkeleton = await common.payFeeByFeeRate(
    txSkeleton,
    [from],
    feeRate,
    undefined,
    { config: RPC_NETWORK }
  );

  // console.log(JSON.stringify(txSkeleton))
  // return ""

  const txSkeletonWEntries = commons.common.prepareSigningEntries(txSkeleton, {
    config: RPC_NETWORK
  });

  const transaction = createTransactionFromSkeleton(txSkeleton);

  const groupedSignature = await owership.signTransaction(transaction);

  const tx = sealTransaction(txSkeletonWEntries, [groupedSignature[0][1]]);

  return sendTransaction(tx);
}
