import { Cell, Script } from "@ckb-lumos/base";
import { since, helpers } from "@ckb-lumos/lumos";
import { dao, common } from "@ckb-lumos/common-scripts";
import { values } from "@ckb-lumos/base";
import { commons } from '@ckb-lumos/lumos';
import {
  TransactionSkeleton,
  TransactionSkeletonType,
  createTransactionFromSkeleton,
  sealTransaction
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
import { sendTransaction, signTransaction } from "../index";
import { DAOUnlockableAmount, FeeRate } from "../../type";
import owership from '../../owership';
import { DEPOSITDAODATA, RPC_NETWORK, TEST_INDEXER } from "../../config/index";
import { getTransactionSkeleton } from "../customCellProvider";

const { ScriptValue } = values;

export enum AddressScriptType {
  SECP256K1_BLAKE160 = "SECP256K1_BLAKE160",
  SUDT = "SUDT",
  DAO = "DAO"
}

export async function withdrawOrUnlock(
  unlockableAmount: DAOUnlockableAmount,
  address: string,
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {
  const res = await owership.getLiveCells();
  const cells = await filterDAOCells(res.objects);

  const cell = await findCellFromUnlockableAmountAndCells(
    unlockableAmount,
    cells
  );

  if (!cell) {
    throw new Error("Cell related to unlockable amount not found!");
  }
  
  return withdrawOrUnlockFromCell(cell, address, feeRate);
}

async function findCellFromUnlockableAmountAndCells(
  unlockableAmount: DAOUnlockableAmount,
  cells: Cell[]
): Promise<Cell> {
  const filtCells = await filterDAOCells(cells);
  const capacity = `0x${unlockableAmount.amount.toString(16)}`;

  for (let i = 0; i < filtCells.length; i += 1) {
    // @ts-ignore
    if (
      filtCells[i].cell_output.capacity === capacity &&
      // @ts-ignore
      filtCells[i].out_point.tx_hash === unlockableAmount.txHash
    ) {
      return filtCells[i];
    }
  }

  // @ts-ignore
  return null;
}

async function withdrawOrUnlockFromCell(
  cell: Cell,
  address: string,
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {
  const feeAddresses = [address];

  // TODO Dao receives and writes his own address
  const to = feeAddresses[0];

  if (!isCellDeposit(cell)) {
    // Check real unlockability
    if (!(await isCellUnlockable(cell))) {
      throw new Error("Cell can not yet be unlocked.");
    }
  }

  return withdraw(cell, feeAddresses, feeRate);
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
  feeAddresses: string[],
  feeRate: FeeRate = FeeRate.NORMAL
): Promise<string> {


  let txSkeleton = getTransactionSkeleton(await owership.getUnusedLocks());

  txSkeleton = await dao.withdraw(txSkeleton, inputCell, undefined, {
    config: RPC_NETWORK
  });


  txSkeleton = await common.payFeeByFeeRate(
    txSkeleton,
    feeAddresses,
    feeRate,
    undefined,
    { config: RPC_NETWORK }
  );

  const localStorage = await window.localStorage.setItem("txSkeleton", JSON.stringify(txSkeleton))

  const txSkeletonWEntries = commons.common.prepareSigningEntries(txSkeleton, {
    config: RPC_NETWORK
  });


  const transaction = createTransactionFromSkeleton(txSkeleton);

  const groupedSignature = await owership.signTransaction(transaction);

  const tx = sealTransaction(txSkeletonWEntries, [groupedSignature[0][1]]);

  return sendTransaction(tx);
}

async function getDepositCellFromWithdrawCell(
  withdrawCell: Cell
): Promise<Cell> {
  const { index, txHash } = await findCorrectInputFromWithdrawCell(
    withdrawCell
  );
  const depositTransaction = await getTransactionFromHash(txHash);

  const depositBlockHeader = await getBlockHeaderFromHash(
    depositTransaction.header.hash
  );

  return {
    cell_output: {
      capacity: withdrawCell.cell_output.capacity,
      lock: { ...withdrawCell.cell_output.lock },
      // @ts-ignore
      type: { ...withdrawCell.cell_output.type }
    },
    out_point: {
      tx_hash: txHash,
      index
    },
    data: DEPOSITDAODATA,
    block_hash: depositBlockHeader.hash,
    block_number: depositBlockHeader.number
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
    .findIndex((input: { cell_output: { lock: any; }; }) =>
      new ScriptValue(input.cell_output.lock, { validate: false }).equals(
        new ScriptValue(fromScript, { validate: false })
      )
    );
}

// Gets the locks script from an address
function getLockFromAddress(address: string): Script {
  return helpers.parseAddress(address, { config: RPC_NETWORK });
}
