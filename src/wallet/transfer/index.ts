
import {
    BI,
    Cell,
    config,
    helpers,
    Indexer,
    RPC,
    Script,
    WitnessArgs,
} from "@ckb-lumos/lumos";
import { bytes } from "@ckb-lumos/codec";
import { blockchain } from "@ckb-lumos/base";
import nexus from '../../nexus';
import { DEFAULTTXFEE, TEST_INDEXER } from '../../config';
import { getLockFromAddress } from '../dao/unlockFromDao';
import { sendTransaction } from '../sendTransaction';

export async function transfer(tansferAmount: bigint, transferToAddress: string) {
    let txHash = ''
    const nexusWallet = await nexus.connect();
    const offChainLocks = await nexusWallet.fullOwnership.getOffChainLocks({})
    let newFullCells = (await nexusWallet.fullOwnership.getLiveCells({})).objects;

    // filter pure CKB cell
    newFullCells = newFullCells.filter(
        // @ts-ignore
        (item) => item.cellOutput.type === undefined && item.data === "0x"
    );
    const transferToLock = await getLockFromAddress(transferToAddress)

    try {
        // const newFullCells = await handleRefresh();
        const changeLock: Script = offChainLocks[0];
        console.log("changeLock", changeLock);
        console.log("target address", transferToAddress);
        console.log("target lock", transferToLock);
        console.log("transfer amount", tansferAmount);
        const preparedCells: any[] = [];
        const transferAmountBI = BI.from(tansferAmount).mul(10 ** 8);
        let prepareAmount = BI.from(0);
        for (let i = 0; i < newFullCells.length; i++) {
            const cellCkbAmount = BI.from(newFullCells[i].cellOutput.capacity);
            preparedCells.push(newFullCells[i]);
            prepareAmount = prepareAmount.add(cellCkbAmount);
            if (
                prepareAmount
                    .sub(1000)
                    .sub(64 * 10 ** 8)
                    .gte(transferAmountBI)
            ) {
                break;
            }
        }
        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: TEST_INDEXER });
        txSkeleton = txSkeleton.update("inputs", (inputs) => {
            return inputs.concat(...preparedCells);
        });

        const outputCells: Cell[] = [];
        outputCells[0] = {
            cellOutput: {
                capacity: transferAmountBI.toHexString(),
                // @ts-ignore
                lock: transferToLock,
            },
            data: "0x",
        };

        outputCells[1] = {
            cellOutput: {
                // change amount = prepareAmount - transferAmount - DEFAULT_TX_FEE shannons for tx fee
                capacity: prepareAmount
                    .sub(transferAmountBI)
                    .sub(DEFAULTTXFEE)
                    .toHexString(),
                lock: changeLock,
            },
            data: "0x",
        };
        txSkeleton = txSkeleton.update("outputs", (outputs) => {
            return outputs.concat(...outputCells);
        });

        txSkeleton = txSkeleton.update("cellDeps", (cellDeps) => {
            return cellDeps.concat({
                outPoint: {
                    txHash:
                        config.predefined.AGGRON4.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
                    index: config.predefined.AGGRON4.SCRIPTS.SECP256K1_BLAKE160.INDEX,
                },
                depType:
                    config.predefined.AGGRON4.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE,
            });
        });
        for (let i = 0; i < preparedCells.length; i++) {
            txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
                witnesses.push("0x")
            );
        }
        const witnessArgs: WitnessArgs = {
            lock: bytes.hexify(new Uint8Array(65)),
        };
        const secp256k1Witness = bytes.hexify(
            blockchain.WitnessArgs.pack(witnessArgs)
        );
        for (let i = 0; i < preparedCells.length; i++) {
            txSkeleton = txSkeleton.update("witnesses", (witnesses) =>
                witnesses.set(i, secp256k1Witness)
            );
        }
        console.log(
            "txSkeleton",
            helpers.transactionSkeletonToObject(txSkeleton)
        );

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
        console.log("tx to send on chain", tx);
        txHash = await sendTransaction(tx);


    } catch (error) {
        console.log("handleTransfer error", error);
    }

    return txHash
}
