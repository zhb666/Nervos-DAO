import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import { Space, Table, Button, notification, Spin } from 'antd';
import { DaoDataObject } from "../../type"
import { cutValue, formatDate } from "../../utils/index"
import { address, BROWSERURL, HTTPRPC, privateKey } from "../../config"
import { UserStore } from "../../stores";
import { getUnlockableAmountsFromCells, withdrawOrUnlock } from "../../wallet"

import './index.css';
import owership from '../../owership';

declare const window: {
	localStorage: {
		getItem: Function;
		setItem: Function;
	};
	open: Function
};

interface Props {
	item: DaoDataObject;
	off: boolean
}

let timer: any = null

const TransactionsTable: React.FC<Props> = ({
	item,
	off
}) => {
	const UserStoreHox = UserStore();
	const { connectWallet } = UserStoreHox;
	const [fromAddr, setFromAddr] = useState(address);
	const [tableData, setTableData] = useState<DaoDataObject[]>([])
	const [loading, setLoading] = useState(false);
	const [txHash, setTxHash] = useState<string>("");//pending = false  success = true

	const columns: ColumnsType<DaoDataObject> = [
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					{Number(record.amount) / 100000000}
				</Space>
			),
		},
		{
			title: 'View Transaction',
			key: 'tx_index',
			align: 'center',
			render: (_, record) => (
				<Space size="middle" onClick={() => {
					getHash(record.txHash)
				}}>
					<a>{cutValue(record.txHash, 5, 5)}</a>
				</Space>
			),
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			align: 'center'
		},
		{
			title: 'State',
			dataIndex: 'state',
			key: 'state',
			align: 'center'
		},
		{
			title: 'Action',
			align: 'center',
			render: (_, record) => (
				<div>
					{record.type === "deposit" ? <Button className='actionButton' disabled={record.state === "pending"} onClick={() => {
						withdraw(record)
					}}>withdraw</Button> : <Button className='actionButton' onClick={() => {
						withdraw(record)
					}} disabled={!record.unlockable} >unlock</Button>}
				</div>
			),
		},
	];

	// get row open url
	const getHash = async (txHash: string) => {
		window.open(`${BROWSERURL.test}/transaction/${txHash}`)
	}

	const withdraw = async (daoData: DaoDataObject) => {

		// @ts-ignore
		// const hash = await withdrawOrUnlock(daoData, privateKeyAgs.address, privateKey, privateKeyAgs.lockScript);
		const hash = await withdrawOrUnlock(daoData, fromAddr);

		if (hash) {
			notification["success"]({
				message: 'success',
				description:
					"success transaction",
			});
		};

		setTxHash(hash)
		setLoading(true)
	}

	// Judge whether the transaction is success
	useEffect(() => {
		if (txHash) {
			timer = setInterval(async () => {
				const txTransaction = await HTTPRPC.getTransaction(txHash);

				if (txTransaction) {
					clearInterval(timer)
					getTableData();
					setLoading(false)
					setTxHash("")
					console.log("close");
				}
			}, 3000)
		}
		return () => clearInterval(timer)
	}, [txHash])


	// Confirm status
	useEffect(() => {
		if (item.txHash) {
			if (off) {
				// get localStorage
				// let daoData = JSON.parse(window.localStorage.getItem('daoData'))
				// setTableData(daoData);
			} else {
				setTableData([item, ...tableData]);
			}
		}
	}, [item, off])


	// get table data
	const getTableData = async () => {
		const cells = await owership.getLiveCells();

		const res = await getUnlockableAmountsFromCells(cells.objects)

		// window.localStorage.setItem("daoData", JSON.stringify(res))
		setTableData(res.reverse());
	};


	useEffect(() => {
		if (connectWallet) {
			getTableData()
		}
	}, [connectWallet])

	return (
		<div className='transactionsTable'>
			<Spin spinning={loading}>
				<Table rowKey={record => record.txHash}
					columns={columns} dataSource={tableData} />
			</Spin>
		</div>
	)
}

export default TransactionsTable;
