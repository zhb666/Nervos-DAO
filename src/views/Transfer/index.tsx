import React, { useEffect, useState } from "react";
import { BI, Cell, helpers, Script } from '@ckb-lumos/lumos';
import { Button, Input, notification } from 'antd';
import { transfer } from "../../wallet";
import { useQuery } from '@tanstack/react-query'
import { shannonToCKBFormatter } from '../../utils';
import { BROWSERURL, RPC_NETWORK } from '../../config';
import { UserStore } from "../../stores";
import Table from '../../components/DaoTable'
import nexus from '../../nexus';
import "./index.css";

const minimumCkb = 61;

const Transfer: React.FC = () => {
    const UserStoreHox = UserStore();
    const { connectWallet, addWalletList } = UserStoreHox;
    const [balance, setBalance] = useState("");
    const [amount, setAmount] = useState<any>("");
    const [toAddr, setToAddr] = useState("");
    const [transferToLock, setTransferToLock] = useState<Script>();
    const [txHash, setTxHash] = useState<any>("");
    const [loading, setLoading] = useState<boolean>(false);

    const send = async () => {
        let msg = ""

        try {
            if (!helpers.addressToScript(toAddr, { config: RPC_NETWORK })) return
        } catch {
            msg = "Address error"
            notification["error"]({
                message: 'error',
                description: msg
            });
            return
        }

        if (!toAddr) {
            msg = "The receiving address is empty"
        }

        if (!amount) {
            msg = "Send ckb cannot be 0"
        }

        if (amount < minimumCkb) {
            msg = `Please enter the amount at least ${minimumCkb} CKB`
        }

        if (msg) {
            notification["error"]({
                message: 'error',
                description: msg
            });
            return
        }

        setLoading(true)

        const txhash = await transfer(amount, toAddr,);
        //   openNotificationWithIcon("success")
        setTxHash(txhash)
        setLoading(false)
    }




    const updateFromInfo = async () => {
        const nexusWallet = await nexus.connect();
        let liveCellsResult = await nexusWallet.fullOwnership.getLiveCells({});
        let fullCells = liveCellsResult.objects;

        while (liveCellsResult.objects.length === 20) {
            liveCellsResult = await nexusWallet.fullOwnership.getLiveCells({
                cursor: liveCellsResult.cursor,
            });
            fullCells.push(...liveCellsResult.objects);
        }

        const balance = fullCells.reduce((acc: any, cell: Cell) => {
            return acc.add(BI.from(cell.cellOutput.capacity));
        }, BI.from(0));

        setBalance(balance.toString());

        return balance.toString()
    };


    const data = useQuery(["data"], () => updateFromInfo(), {
        refetchInterval: 2000,
    })

    return (
        <div className='mian'>
            <h3>Account</h3>
            <ul className='address'>
                <li>Total CKB : {connectWallet ? shannonToCKBFormatter(balance, false, '') : "Please connect Nexus Wallet"}</li>
            </ul>
            <h3>Send to Address</h3>

            <Input
                id="to-address"
                type="text"
                disabled={!connectWallet}
                placeholder='Please enter receiving address'
                value={toAddr}
                onChange={(e) => setToAddr(e.target.value || '')}
            />
            <br />
            <h3 className='h3'>Amount </h3>

            <Input
                id="amount"
                type="text"
                autoComplete="off"
                disabled={!connectWallet}
                placeholder={`Please enter the amount at least ${minimumCkb} CKB`}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <br />
            {
                !connectWallet ?
                    <Button className='sendButton' type="primary" block onClick={() => {
                        addWalletList(true)
                    }}>
                        Connect Wallet
                    </Button> : <Button className='sendButton' disabled={loading} type="primary" block onClick={send}>
                        Transfer
                    </Button>
            }

            {txHash ? <p className='txHash'>Transaction Hash : <a target="_blank" href={`${BROWSERURL.test}/transaction/${txHash}`}>{txHash}</a></p> : null}

            {/* <div className="Table">
                <Table item={txHash} off={off} />
            </div> */}
        </div>
    )
}

export default Transfer


