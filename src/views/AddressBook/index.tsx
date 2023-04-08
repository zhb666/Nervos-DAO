import React, { useEffect, useState } from "react";
import { BI, Cell, helpers, Script } from '@ckb-lumos/lumos';
import { notification, Space, Spin } from 'antd';

import { cutValue, openBrowserUrl, shannonToCKBFormatter } from '../../utils';
import { RPC_NETWORK } from '../../config';
import { UserStore } from "../../stores";
import nexus from '../../nexus';
import "./index.css";
import Table, { ColumnsType } from 'antd/lib/table';

export interface AddressList {
    amount: any;
    address: string;
}

const columns: ColumnsType<AddressList> = [
    {
        title: 'Transfer Address',
        dataIndex: 'address',
        key: 'address',
        render: (_, record) => (
            <Space size="middle" onClick={() => {
                openBrowserUrl(record.address, "address")
            }}>
                <a>{cutValue(record.address, 8, 8)}</a>
            </Space>
        ),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (_, record) => (
            <Space size="middle">
                {record.amount + " CKB"}
            </Space>
        ),
    },
];


const Transfer: React.FC = () => {
    const UserStoreHox = UserStore();
    const { connectWallet } = UserStoreHox;
    const [addressList, setAddressList] = useState<AddressList[]>([])
    const [loading, setLoading] = useState<boolean>(false);


    const addressBookList = async () => {
        setLoading(true)
        const list: AddressList[] = []
        const nexusWallet = await nexus.connect();
        let fullCells = await nexus.getLiveCells();
        const getOffChainLocks = await nexusWallet.fullOwnership.getOffChainLocks({});

        fullCells.forEach((cell: any) => {
            // get address
            const address = helpers.encodeToAddress(cell.cellOutput.lock, { config: RPC_NETWORK });

            const balance = BI.from(cell.cellOutput.capacity)

            list.push({
                address: address,
                amount: shannonToCKBFormatter(balance.toString(), false, '')
            })

        });


        getOffChainLocks.forEach((item: any) => {
            // get address
            const address = helpers.encodeToAddress(item, { config: RPC_NETWORK });

            list.push({
                address: address,
                amount: "0.00"
            })

        });

        const result = list.reduce((accumulator: AddressList[], current) => {
            const existingItem = accumulator.find(item => item.address === current.address);
            if (existingItem) {
                existingItem.amount += Number(current.amount.split(" ")[0]);
            } else {
                accumulator.push({
                    address: current.address,
                    amount: Number(current.amount.split(" ")[0])
                });
            }
            return accumulator;
        }, []);

        setAddressList(result)
        setLoading(false)
    };

    useEffect(() => {
        if (connectWallet) {
            addressBookList()
        }
    }, [connectWallet])

    return (
        <div className='mian'>
            <h3>Address Book</h3>

            <Spin spinning={loading}>
                <Table className='table' rowKey={(record => record.address)}
                    columns={columns} dataSource={addressList} />
            </Spin>
        </div>
    )
}

export default Transfer


