import { BI, helpers, Script } from "@ckb-lumos/lumos";
import { sendTransaction } from "./sendTransaction";
import {
  deposit,
  getUnlockableAmountsFromCells,
  withdrawOrUnlock
} from "./dao";

import nexus from '../nexus';
import { RPC_NETWORK } from '../config';
import { transfer } from './transfer';

async function capacityOf(): Promise<BI> {
  let balance = BI.from(0);
  const nexusWallet = await nexus.connect();
  const cells = await nexusWallet.fullOwnership.getLiveCells({});
  // let cells = await owership.getLiveCells();
  for (const cell of cells.objects) {
    balance = balance.add(cell.cellOutput.capacity);
  }
  return balance;
}

function hexDataOccupiedBytes(hex_string: string) {
  // Exclude 0x prefix, and every 2 hex digits are one byte
  return (hex_string.length - 2) / 2;
}

function scriptOccupiedBytes(script: Script) {
  if (script !== undefined && script !== null) {
    return hexDataOccupiedBytes(script.args);
  }
  return 0;
}

function cellOccupiedBytes(script: Script) {
  return 8 + 32 + 1 + 0 + 0 + scriptOccupiedBytes(script);
}

function getAddress(script: Script) {
  const address = helpers.encodeToAddress(script, { config: RPC_NETWORK });
  return address
}

export {
  capacityOf,
  sendTransaction,
  deposit,
  cellOccupiedBytes,
  getUnlockableAmountsFromCells,
  withdrawOrUnlock,
  getAddress,
  transfer
};
