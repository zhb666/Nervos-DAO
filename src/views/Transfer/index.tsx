import React, { useEffect, useState } from "react";
import { BI, Cell, helpers, Script } from '@ckb-lumos/lumos';
import { Button, Input, notification, Space, Spin } from 'antd';
import { transfer } from "../../wallet";
import { useQuery } from '@tanstack/react-query'
import { cutValue, formatDate, openBrowserUrl, shannonToCKBFormatter } from '../../utils';
import { BROWSERURL, RPC_NETWORK } from '../../config';
import { UserStore } from "../../stores";
import nexus from '../../nexus';
import "./index.css";
import Table, { ColumnsType } from 'antd/lib/table';

const minimumCkb = 61;

declare const window: {
    open: Function;
    localStorage: {
        getItem: Function;
        setItem: Function;
    };
};

export interface TransferList {
    amount: any;
    timestamp: number;
    hash: string;
    address: string;
}

let localTransferList = JSON.parse(window.localStorage.getItem('localTransferList')) || []


const columns: ColumnsType<TransferList> = [
    {
        title: 'Date',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (_, record) => (
            <Space size="middle">
                {formatDate(record.timestamp)}
            </Space>
        ),
    },
    {
        title: 'Transfer Address',
        dataIndex: 'address',
        key: 'address',
        render: (_, record) => (
            <Space size="middle">
                <a>{cutValue(record.address, 8, 8)}</a>
            </Space>
        ),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'View Transaction',
        key: 'tx_index',
        render: (_, record) => (
            <Space size="middle" onClick={() => {
                openBrowserUrl(record.hash, "transaction")
            }}>
                <a>{cutValue(record.hash, 8, 8)}</a>
            </Space>
        ),
    }
];


const Transfer: React.FC = () => {
    const UserStoreHox = UserStore();
    const { connectWallet, addWalletList } = UserStoreHox;
    const [balance, setBalance] = useState("");
    const [amount, setAmount] = useState<any>("");
    const [toAddr, setToAddr] = useState("");
    const [txHash, setTxHash] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [transferList, setTransferList] = useState<TransferList[]>(localTransferList)

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
        notification["success"]({
            message: 'success',
        });
        setTxHash(txhash)
        setLoading(false)

        const list = [{
            address: toAddr,
            timestamp: Date.now(),
            amount: amount + " CKB",
            hash: txhash
        }, ...transferList]

        setTransferList(list)

        window.localStorage.setItem("localTransferList", JSON.stringify(list))
        updateFromInfo();
    }

    const updateFromInfo = async () => {
        let liveCellsResult = await await nexus.getLiveCells();

        const balance = liveCellsResult.reduce((acc: any, cell: Cell) => {
            return acc.add(BI.from(cell.cellOutput.capacity));
        }, BI.from(0));

        setBalance(balance.toString());
        return balance.toString()
    };

    // const data = useQuery(["data"], () => updateFromInfo(), {
    // })

    useEffect(() => {
        if (connectWallet) {
            updateFromInfo()
        }
    }, [])

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
                    <Button className='sendButton' type="primary" block onClick={async () => {
                        const res = await nexus.connect()
                        if (res) {
                            addWalletList(true)
                        } else {
                            alert("Need to download nexus wallet")
                        }
                    }}>
                        Connect Wallet
                    </Button> : <Button className='sendButton' disabled={loading} type="primary" block onClick={send}>
                        Transfer
                    </Button>
            }

            {txHash ? <p className='txHash'>Transaction Hash : <a target="_blank" href={`${BROWSERURL.test}/transaction/${txHash}`}>{txHash}</a></p> : null}

            <Spin spinning={loading}>
                <Table className='table' rowKey={(record => record.hash)}
                    columns={columns} dataSource={transferList} />
            </Spin>
        </div>
    )
}

export default Transfer


