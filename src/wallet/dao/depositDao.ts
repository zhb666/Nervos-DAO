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
    console.log(fullCells, "fullCells");

    const changeLock: Script = offChainLocks[0];
    console.log("changeLock", changeLock);
    console.log("transfer amount", amount);
    const preparedCells: any[] = [];
    const transferAmountBI = BI.from(amount).mul(10 ** 8);
    console.log(transferAmountBI.toString(), "transferAmountBI");

    let prepareAmount = BI.from(0);
    for (let i = 0; i < fullCells.length; i++) {
      console.log(fullCells, "fullCells_______");

      const cellCkbAmount = BI.from(fullCells[i].cellOutput.capacity);
      preparedCells.push(fullCells[i]);
      prepareAmount = prepareAmount.add(cellCkbAmount);
      if (prepareAmount.gte(transferAmountBI)) {
        break;
      }
    }

    const indexer = new Indexer("https://testnet.ckb.dev");
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

    //   const cellDepsOutPoint:CellDep = []
    //   cellDepsOutPoint[0] = {
    //     outPoint: {
    //       txHash:
    //         config.predefined.AGGRON4.SCRIPTS.DAO.TX_HASH,
    //       index: config.predefined.AGGRON4.SCRIPTS.DAO.INDEX,
    //     },
    //     depType:
    //       config.predefined.AGGRON4.SCRIPTS.DAO.DEP_TYPE,
    //   }
    //   cellDepsOutPoint[1] = {
    //     "outPoint": {
    //         "txHash": "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
    //         "index": "0x0"
    //     },
    //     "depType": "dep_group"
    // }


    // TODO Need to config
    let cellDepsOutPoint = [
      {
        outPoint: {
          txHash: "0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f",
          index: "0x2"
        },
        depType: "code"
      },
      {
        outPoint: {
          txHash: "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
          index: "0x0"
        },
        depType: "depGroup"
      }
    ]

    txSkeleton = txSkeleton.update("cellDeps", (cellDeps) => {
      return cellDeps.concat(...cellDepsOutPoint);
    });
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


    // console.log("tx to send on chain", tx);
    // // const rpc = new RPC("https://testnet.ckb.dev");
    // // const txHash = await rpc.sendTransaction(tx);
    // console.log("txHash", txHash);

  } catch (error) {
    console.log("handleTransfer error", error);
  }

  return txHash

  const address = getAddress(offChainLocks[0])
}
