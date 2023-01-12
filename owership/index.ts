import { Script, Transaction } from '@ckb-lumos/lumos'
import { TransactionSkeletonType } from "@ckb-lumos/helpers";
import {signTransaction} from "../wallet"
import { cells, script } from '../mock/data';

const owership = {
    getLiveCells() { 
        return Promise.resolve(cells)
    },
    getUnusedLocks(): Promise<Script> {return Promise.resolve(script)},
    async signTransaction(tx: Transaction): Promise<Transaction> { 
        return Promise.resolve(await signTransaction(tx))
    },
}

export default owership
