import { render } from '@testing-library/react';
import { Cell, Script } from "@ckb-lumos/base";
import { since, helpers, WitnessArgs, BI } from "@ckb-lumos/lumos";
import { dao, common } from "@ckb-lumos/common-scripts";
import { values } from "@ckb-lumos/base";
import { bytes, number } from "@ckb-lumos/codec";
import { blockchain } from "@ckb-lumos/base";
import {
  TransactionSkeletonType,
  createTransactionFromSkeleton,
} from "@ckb-lumos/helpers";
import {
  filterDAOCells,
  isCellDeposit,
  getCurrentBlockHeader,
  getDepositDaoEarliestSince,
  getWithdrawDaoEarliestSince,
  findCorrectInputFromWithdrawCell,
  getTransactionFromHash,
  getBlockHeaderFromHash
} from "./index";
import { getAddress, sendTransaction, signTransaction } from "../index";
import { DAOUnlockableAmount, FeeRate } from "../../type";
import { DEPOSITDAODATA, RPC_NETWORK, TEST_INDEXER, TEST_CKB_RPC_URL } from "../../config/index";
import { getTransactionSkeleton } from "../customCellProvider";
import { jsonToHump } from '../../utils/pubilc';
import nexus from '../../nexus';
import { loadScriptDeps } from './cellDepsLoader';

const { ScriptValue } = values;

export enum AddressScriptType {
  SECP256K1_BLAKE160 = "SECP256K1_BLAKE160",
  SUDT = "SUDT",
  DAO = "DAO"
}

export async function withdrawOrUnlock(
  unlockableAmount: DAOUnlockableAmount,
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {
  const nexusWallet = await nexus.connect();
  const fullCells = (await nexusWallet.fullOwnership.getLiveCells({})).objects;
  // @ts-ignore
  const cells = await filterDAOCells(fullCells);

  const cell = await findCellFromUnlockableAmountAndCells(
    unlockableAmount,
    cells
  );

  if (!cell) {
    throw new Error("Cell related to unlockable amount not found!");
  }

  return withdrawOrUnlockFromCell(cell, feeRate);
}

async function findCellFromUnlockableAmountAndCells(
  unlockableAmount: DAOUnlockableAmount,
  cells: Cell[]
): Promise<Cell> {
  const filtCells = await filterDAOCells(cells);
  const capacity = `0x${unlockableAmount.amount.toString(16)}`;

  for (let i = 0; i < filtCells.length; i += 1) {
    if (
      filtCells[i].cellOutput.capacity === capacity &&
      // @ts-ignore
      filtCells[i].outPoint.txHash === unlockableAmount.txHash
    ) {
      return filtCells[i];
    }
  }

  // @ts-ignore
  return null;
}

async function withdrawOrUnlockFromCell(
  cell: Cell,
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {
  if (!isCellDeposit(cell)) {
    // TODO 
    // Check real unlockability
    // if (!(await isCellUnlockable(cell))) {
    //   throw new Error("Cell can not yet be unlocked.");
    // }
    return unlock(
      cell,
      feeRate
    );
  }

  return withdraw(cell, feeRate);
}

async function isCellUnlockable(cell: Cell): Promise<boolean> {
  let sinceBI: bigint;
  const currentBlockHeader = await getCurrentBlockHeader();
  const currentEpoch = since.parseEpoch(currentBlockHeader.epoch);

  if (isCellDeposit(cell)) {
    sinceBI = await getDepositDaoEarliestSince(cell);
  } else {
    sinceBI = await getWithdrawDaoEarliestSince(cell);
  }
  const earliestSince = since.parseAbsoluteEpochSince(sinceBI.toString());

  const unlockable =
    currentEpoch.number > earliestSince.number ||
    (currentEpoch.number === earliestSince.number &&
      currentEpoch.index >= earliestSince.index);
  return unlockable;
}

async function withdraw(
  inputCell: Cell,
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {

  const nexusWallet = await nexus.connect();
  const offChainLocks = await nexusWallet.fullOwnership.getOffChainLocks({})
  const fullCells = (await nexusWallet.fullOwnership.getLiveCells({})).objects;


  const changeLock: Script = offChainLocks[0];
  console.log(changeLock, "changeLock");

  const preparedCells: Cell[] = [];
  const transferAmountBI = BI.from(1).mul(10 ** 8);
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


  let txSkeleton = getTransactionSkeleton(offChainLocks[0]);

  const onChainScripts = await loadScriptDeps({ nodeUrl: TEST_CKB_RPC_URL })
  txSkeleton = await dao.withdraw(txSkeleton, inputCell, undefined, {
    config: {
      PREFIX: RPC_NETWORK.PREFIX,
      SCRIPTS: {
        ...RPC_NETWORK.SCRIPTS,
        DAO: onChainScripts.DAO,
        SECP256K1_BLAKE160: onChainScripts.SECP256K1_BLAKE160,
      },
    }
  });

  console.log(preparedCells, "changeLock");

  txSkeleton = txSkeleton.update("inputs", (inputs) => {
    return inputs.concat(...preparedCells);
  });

  const outputCells: Cell[] = [];

  outputCells[0] = {
    cellOutput: {
      // change amount = prepareAmount - transferAmount - 1000 shannons for tx fee
      capacity: prepareAmount.sub(feeRate).sub(1000).toHexString(),
      lock: changeLock,
      // lock: preparedCells[0].cellOutput.lock,
    },
    data: "0x",
  };
  txSkeleton = txSkeleton.update("outputs", (outputs) => {
    return outputs.concat(...outputCells);
  });

  // TODO bytes.hexify(blockchain.witness.pack({ lock: bytes.hexify(Buffer.alloc(65))}))
  txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
    witnesses.concat("0x55000000100000005500000055000000410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
  );



  const tx = createTransactionFromSkeleton(txSkeleton);
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

  console.log("tx to sign:", tx);

  return await sendTransaction(tx);
}

async function unlock(
  withdrawCell: Cell,
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {
  jsonToHump(withdrawCell)
  const nexusWallet = await nexus.connect();
  const offChainLocks = await nexusWallet.fullOwnership.getOffChainLocks({})
  const fullCells = (await nexusWallet.fullOwnership.getLiveCells({})).objects;

  const changeLock: Script = offChainLocks[0];
  console.log(changeLock, "changeLock");

  const depositCell = await getDepositCellFromWithdrawCell(withdrawCell);

  const address = getAddress(offChainLocks[0])
  // TODO
  // if (!(await isCellUnlockable(withdrawCell))) {
  //   throw new Error("Cell can not be unlocked. Minimum time is 30 days.");
  // }

  const preparedCells: Cell[] = [];
  const transferAmountBI = BI.from(1).mul(10 ** 8);
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

  let txSkeleton = getTransactionSkeleton(offChainLocks[0]);
  console.log(offChainLocks, "offChainLocks");

  // TODO: make me configurable
  const onChainScripts = await loadScriptDeps({ nodeUrl: TEST_CKB_RPC_URL })
  txSkeleton = await dao.unlock(
    txSkeleton,
    depositCell,
    withdrawCell,
    address,
    address,
    {
      config: {
        PREFIX: RPC_NETWORK.PREFIX,
        SCRIPTS: {
          ...RPC_NETWORK.SCRIPTS,
          DAO: onChainScripts.DAO,
          SECP256K1_BLAKE160: onChainScripts.SECP256K1_BLAKE160,
        },
      }
    }
  );

  txSkeleton = txSkeleton.update("inputs", (inputs) => {
    return inputs.concat(...preparedCells);
  });

  const txFeeProviderCell = {
    cellOutput: {
      capacity: prepareAmount.sub(feeRate).toHexString(),
      lock: changeLock,
    },
    data: "0x",
  };

  txSkeleton = txSkeleton.update("outputs", (outputs) => {
    return outputs.concat(txFeeProviderCell);
  });

  txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
    witnesses.concat(bytes.hexify(blockchain.WitnessArgs.pack({ lock: bytes.hexify(Buffer.alloc(65)) })))
  );

  const tx = createTransactionFromSkeleton(txSkeleton);
  const signatures: any[] = await nexusWallet.fullOwnership.signTransaction({ tx });
  for (let index = 0; index < signatures.length; index++) {
    const [_, sig] = signatures[index];
    const newWitnessArgs: WitnessArgs = {
      lock: sig,
      inputType: bytes.hexify(number.Uint64.pack(0)),
    };
    const newWitness = bytes.hexify(
      blockchain.WitnessArgs.pack(newWitnessArgs)
    );
    tx.witnesses[index] = newWitness;
  }

  console.log("signed tx:", tx);
  return await sendTransaction(tx);
}

async function getDepositCellFromWithdrawCell(
  withdrawCell: Cell
): Promise<Cell> {
  const { index, txHash } = await findCorrectInputFromWithdrawCell(
    withdrawCell
  );

  const depositTransaction = await getTransactionFromHash(txHash);

  const depositBlockHeader = await getBlockHeaderFromHash(
    depositTransaction.txStatus.blockHash
  );

  return {
    cellOutput: {
      capacity: withdrawCell.cellOutput.capacity,
      lock: { ...withdrawCell.cellOutput.lock },
      // @ts-ignore
      type: { ...withdrawCell.cellOutput.type }
    },
    outPoint: {
      txHash: txHash,
      index
    },
    data: DEPOSITDAODATA,
    blockHash: depositBlockHeader.hash,
    blockNumber: depositBlockHeader.number
  };
}

function extractPrivateKeys(
  txSkeleton: TransactionSkeletonType,
  fromAddresses: string[],
  privateKeys: string[]
): string[] {
  const signingPrivKeys: string[] = [];

  for (let i = 0; i < fromAddresses.length; i += 1) {
    if (
      getScriptFirstIndex(txSkeleton, getLockFromAddress(fromAddresses[i])) !==
      -1
    ) {
      signingPrivKeys.push(privateKeys[i]);
    }
  }

  return signingPrivKeys;
}

function getScriptFirstIndex(
  txSkeleton: TransactionSkeletonType,
  fromScript: Script
): number {
  return txSkeleton
    .get("inputs")
    .findIndex((input: { cellOutput: { lock: any; }; }) =>
      new ScriptValue(input.cellOutput.lock, { validate: false }).equals(
        new ScriptValue(fromScript, { validate: false })
      )
    );
}

// Gets the locks script from an address
function getLockFromAddress(address: string): Script {
  return helpers.parseAddress(address, { config: RPC_NETWORK });
}

// function getNextAddress(): string {
//   return getAddress(firstRIndexWithoutTxs, AddressType.Receiving);
// }

// // Gets address from a specific accountId, addressType and script type
// function getAddress(accountId = 0, addressType: AddressType, script: AddressScriptType = AddressScriptType.SECP256K1_BLAKE160): string {
//     const key = `${accountId}-${addressType}-${script}`;
//     if (!this.addressMap[key]) {
//         const address = this.connection.getAddressFromLock(this.getLock(accountId, addressType, script));
//         this.addressMap[key] = address;
//     }

//     return this.addressMap[key];
// }
