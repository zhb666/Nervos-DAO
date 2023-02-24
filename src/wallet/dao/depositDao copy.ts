import { dao, common } from "@ckb-lumos/common-scripts";
import { createTransactionFromSkeleton, sealTransaction } from "@ckb-lumos/helpers";
import { DAOCELLSIZE, RPC_NETWORK } from "../../config";
import { FeeRate } from "../../type";
import { getTransactionSkeleton } from "../customCellProvider";
import owership from '../../owership';
import { sendTransaction } from '../sendTransaction';
// import { json } from 'stream/consumers';
import { commons, Script } from '@ckb-lumos/lumos';
import nexus from '../../nexus';
import { getAddress } from '../index';

export async function deposit(
  amount: bigint,
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {
  if (amount < DAOCELLSIZE) {
    throw new Error("Minimum deposit value is 102 CKB");
  }

  const nexusWallet = await nexus.connect();
  const offChainLocks = await nexusWallet.fullOwnership.getOffChainLocks({})
  const cells = await nexusWallet.fullOwnership.getLiveCells({});

  console.log(cells);

  const address = getAddress(offChainLocks[0])

  //   const lock:Script = {
  //     "args": "0xaa3ac4d7dd69da19e0f129eedadfb311e5f79b0f",
  //     "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  //     "hashType": "type"
  // }


  //   const address = getAddress(lock)

  console.log(address);


  // return ""

  const from = address
  const to = address

  let txSkeleton = getTransactionSkeleton(offChainLocks[0]);

  console.log(JSON.stringify(txSkeleton), "到这里了吗");


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


  const localStorage = await window.localStorage.setItem("txSkeleton", JSON.stringify(txSkeleton))
  const txSkeletonWEntries = commons.common.prepareSigningEntries(txSkeleton, {
    config: RPC_NETWORK
  });


  const transaction = createTransactionFromSkeleton(txSkeleton);

  // const groupedSignature = await owership.signTransaction(transaction);
  const groupedSignature = await nexusWallet.fullOwnership.signTransaction({ transaction });

  console.log(groupedSignature);

  return ""


  const tx = sealTransaction(txSkeletonWEntries, [groupedSignature[0][1]]);

  return sendTransaction(tx);
}
