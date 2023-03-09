import { dao, common } from "@ckb-lumos/common-scripts";
import { createTransactionFromSkeleton, sealTransaction } from "@ckb-lumos/helpers";
import { DAOCELLSIZE, HTTPRPC, RPC_NETWORK } from "../../config";
import { FeeRate } from "../../type";
import { getTransactionSkeleton } from "../customCellProvider";
import owership from '../../owership';
import { sendTransaction } from '../sendTransaction';
// import { json } from 'stream/consumers';
import { BI, Cell, CellDep, commons, config, helpers, Indexer, Script, utils, WitnessArgs } from '@ckb-lumos/lumos';
import { bytes } from "@ckb-lumos/codec";
import { blockchain } from "@ckb-lumos/base";
import nexus from '../../nexus';
import { getAddress } from '../index';
import { nonNullable } from './utils';

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

  // await HTTPRPC.getBlockByNumber("0x0");

  const genesisBlock = await HTTPRPC.getBlockByNumber('0x0');

  if (!genesisBlock) throw new Error('cannot load genesis block');

  const secp256k1DepTxHash = nonNullable(genesisBlock.transactions[1]).hash;
  const typeScript = nonNullable(nonNullable(genesisBlock.transactions[0]).outputs[1]).type;

  if (!secp256k1DepTxHash) throw new Error('Cannot load secp256k1 transaction');
  if (!typeScript) throw new Error('cannot load secp256k1 type script');

  const secp256k1TypeHash = utils.computeScriptHash(typeScript);

  //   console.log({
  //     HASH_TYPE: 'type',
  //     CODE_HASH: secp256k1TypeHash,
  //     INDEX: '0x0',
  //     TX_HASH: secp256k1DepTxHash,
  //     DEP_TYPE: 'dep_group',
  //   })

  // //   {
  // //     "HASH_TYPE": "type",
  // //     "CODE_HASH": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  // //     "INDEX": "0x0",
  // //     "TX_HASH": "0x530d9f9de45fdcda8a2c7df86007711d932a43277057baf0aead7f88eaec01e2",
  // //     "DEP_TYPE": "dep_group"
  // // }

  // return ""


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
    const indexer = new Indexer("http://127.0.0.1:8114");

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
          // txHash: "0x8f8c79eb6671709633fe6a46de93c0fedc9c1b8a6527a18d3983879542635c9f",
          // txHash: "0x530d9f9de45fdcda8a2c7df86007711d932a43277057baf0aead7f88eaec01e2",
          // txHash: "0x5f4345733735a12e0000c16ff2862300ba73e3e0940500000099f54b01fbfe06",
          txHash: "0x76c935b7d7fc23998776d155def89808be87077052b5248546c82fde3943b1da",
          index: "0x2"
        },
        depType: "code"
      },
      {
        outPoint: {
          // txHash: "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
          // txHash: "0x5f4345733735a12e0000c16ff2862300ba73e3e0940500000099f54b01fbfe06",
          txHash: "0x530d9f9de45fdcda8a2c7df86007711d932a43277057baf0aead7f88eaec01e2",
          // txHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          index: "0x0"
        },
        depType: "depGroup"
      }
    ]
    // @ts-ignore
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

  } catch (error) {
    console.log("handleTransfer error", error);
  }

  return txHash

  const address = getAddress(offChainLocks[0])
}
