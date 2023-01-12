import { dao, common } from "@ckb-lumos/common-scripts";
import { createTransactionFromSkeleton ,createTransactionSkeleton} from "@ckb-lumos/helpers";
import { DAOCELLSIZE, RPC_NETWORK,address } from "../../config";
import { FeeRate } from "../../type";
import { getTransactionSkeleton } from "../customCellProvider";
import owership from '../../owership';
import { sendTransaction } from '../sendTransaction';
import { json } from 'stream/consumers';

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

  const transaction = createTransactionFromSkeleton(txSkeleton);

  const tx = await owership.signTransaction(transaction);

  return sendTransaction(tx);
}
