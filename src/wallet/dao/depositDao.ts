import { dao, common } from "@ckb-lumos/common-scripts";
import { createTransactionFromSkeleton, sealTransaction } from "@ckb-lumos/helpers";
import { DAOCELLSIZE, RPC_NETWORK } from "../../config";
import { FeeRate } from "../../type";
import { getTransactionSkeleton } from "../customCellProvider";
import owership from '../../owership';
import { sendTransaction } from '../sendTransaction';
// import { json } from 'stream/consumers';
import { BI, Cell, CellDep, commons, config, helpers, Indexer, Script, WitnessArgs } from '@ckb-lumos/lumos';
import { bytes } from "@ckb-lumos/codec";
import { blockchain } from "@ckb-lumos/base";
import nexus from '../../nexus';
import { getAddress } from '../index';
import { appendScriptDeps } from "./cellDepsLoader";

export async function deposit(
  amount: bigint,
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {
  // if (amount < DAOCELLSIZE) {
  //   throw new Error("Minimum deposit value is 102 CKB");
  // }
  let txHash = ''
  const nexusWallet = await nexus.connect();
  const offChainLocks = await nexusWallet.fullOwnership.getOffChainLocks({})
  const fullCells = (await nexusWallet.fullOwnership.getLiveCells({})).objects;

  try {
    const changeLock: Script = offChainLocks[0];
    console.log("changeLock", changeLock);
    console.log("transfer amount", amount);
    const preparedCells: any[] = [];
    const transferAmountBI = BI.from(amount).mul(10 ** 8);
    console.log(transferAmountBI.toString(), "transferAmountBI");

    let prepareAmount = BI.from(0);
    for (let i = 0; i < fullCells.length; i++) {
      if (!fullCells[i].cellOutput.type) {
        const cellCkbAmount = BI.from(fullCells[i].cellOutput.capacity);
        preparedCells.push(fullCells[i]);
        prepareAmount = prepareAmount.add(cellCkbAmount);
        if (prepareAmount.gte(transferAmountBI)) {
          break;
        }
      }
    }

    // const indexer = new Indexer("https://testnet.ckb.dev");
    const indexer = new Indexer("http://localhost:8114");
    let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
    txSkeleton = txSkeleton.update("inputs", (inputs) => {
      return inputs.concat(...preparedCells);
    });

    const outputCells: Cell[] = [];
    outputCells[0] = {
      cellOutput: {
        capacity: transferAmountBI.toHexString(),
        lock: changeLock,
        "type": {
          "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
          "args": "0x",
          "hashType": "type"
        }
      },
      data: "0x0000000000000000",
    };
    outputCells[1] = {
      cellOutput: {
        // change amount = prepareAmount - transferAmount - 1000 shannons for tx fee
        capacity: prepareAmount.sub(transferAmountBI).sub(1000).toHexString(),
        lock: changeLock,
      },
      data: "0x",
    };
    txSkeleton = txSkeleton.update("outputs", (outputs) => {
      return outputs.concat(...outputCells);
    });

    txSkeleton = await appendScriptDeps({ txSkeleton, nodeUrl: 'http://localhost:8114' });
    
    for (let i = 0; i < preparedCells.length; i++) {
      txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
        witnesses.push("0x")
      );
    }


    const witnessArgs: WitnessArgs = {
      /* 65-byte zeros in hex */
      lock: "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    };
    const secp256k1Witness = bytes.hexify(
      blockchain.WitnessArgs.pack(witnessArgs)
    );
    for (let i = 0; i < preparedCells.length; i++) {
      txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
        witnesses.set(i, secp256k1Witness)
      );
    }

    console.log(JSON.parse(JSON.stringify(txSkeleton)), "txSkeleton");

    const tx = helpers.createTransactionFromSkeleton(txSkeleton);
    console.log("tx to sign:", tx);

    const signatures: any[] = await nexusWallet.fullOwnership.signTransaction({ tx });

    console.log("signatures", signatures);
    for (let index = 0; index < signatures.length; index++) {
      const [lock, sig] = signatures[index];
      const newWitnessArgs: WitnessArgs = {
        lock: sig,
      };
      const newWitness = bytes.hexify(
        blockchain.WitnessArgs.pack(newWitnessArgs)
      );
      tx.witnesses[index] = newWitness;
    }

    txHash = await sendTransaction(tx);

  } catch (error) {
    console.log("handleTransfer error", error);
  }

  return txHash
}
