import { BI } from "@ckb-lumos/lumos";
import { signTransaction } from "./signTransaction";
import { sendTransaction } from "./sendTransaction";
import {
  deposit,
  getUnlockableAmountsFromCells,
  withdrawOrUnlock
} from "./dao";

import { ScriptObject } from "../type";
import owership  from "../owership";

async function capacityOf(): Promise<BI> {
  // Convert to bi object
  let balance = BI.from(0);

  let cells = await owership.getLiveCells();

  for (const cell of cells.objects) {
    balance = balance.add(cell.cellOutput.capacity);
  }
  return balance;
}

function hexDataOccupiedBytes(hex_string: string) {
  // Exclude 0x prefix, and every 2 hex digits are one byte
  return (hex_string.length - 2) / 2;
}

function scriptOccupiedBytes(script: ScriptObject) {
  if (script !== undefined && script !== null) {
    return hexDataOccupiedBytes(script.args);
  }
  return 0;
}

function cellOccupiedBytes(script: ScriptObject) {
  return 8 + 32 + 1 + 0 + 0 + scriptOccupiedBytes(script);
}

export {
  signTransaction,
  capacityOf,
  sendTransaction,
  deposit,
  cellOccupiedBytes,
  getUnlockableAmountsFromCells,
  withdrawOrUnlock
};
