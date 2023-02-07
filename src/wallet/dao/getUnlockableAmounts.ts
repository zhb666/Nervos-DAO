import { Cell, Script, Header, TransactionWithStatus } from "@ckb-lumos/base";
import { since } from "@ckb-lumos/lumos";
import { dao } from "@ckb-lumos/common-scripts";
import { DAOUnlockableAmount } from "../../type";
import { DEPOSITDAODATA, HTTPRPC } from "../../config";
import owership from '../../owership';

export enum DAOCellType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  ALL = "all"
}


export async function getDAOUnlockableAmounts() 
{
  const res = await owership.getLiveCells();
}


export function isCellDeposit(cell: Cell): boolean {
  return cell.data === DEPOSITDAODATA;
}


