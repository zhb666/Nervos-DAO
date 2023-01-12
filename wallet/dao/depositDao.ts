import { dao, common } from "@ckb-lumos/common-scripts";
import { DAOCELLSIZE, RPC_NETWORK,privateKey,address } from "../../config";
import { FeeRate } from "../../type";
import { getTransactionSkeleton } from "../customCellProvider";
import owership from '../../owership';
import { sendTransaction } from '../sendTransaction';

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

  console.log(txSkeleton,"txSkeleton____");

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
  const tx = await owership.signTransaction(txSkeleton, [privateKey]);

  return sendTransaction(tx);
}
