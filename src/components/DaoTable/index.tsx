import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import { Space, Table, Button, notification, Spin } from 'antd';
import { DaoDataObject } from "../../type"
import { cutValue, formatDate } from "../../utils/index"
import { BROWSERURL, HTTPRPC } from "../../config"
import { UserStore } from "../../stores";
import { getUnlockableAmountsFromCells, withdrawOrUnlock } from "../../wallet"

import './index.css';
import nexus from '../../nexus';

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
let timercCursor: any = false


const TransactionsTable: React.FC<Props> = ({
	item,
	off
}) => {
	const UserStoreHox = UserStore();
	const { connectWallet, balance } = UserStoreHox;
	const [tableData, setTableData] = useState<DaoDataObject[]>([])
	const [loading, setLoading] = useState(false);
	const [fullCells, setFullCells] = useState<any>([]);
	const [lastCursor, setLastCursor] = useState<string>('');

	const [txHash, setTxHash] = useState<string>("");//pending = false  success = true

	const columns: ColumnsType<DaoDataObject> = [
		// {
		// 	title: 'Date',
		// 	dataIndex: 'timestamp',
		// 	key: 'timestamp',
		// align: 'center',
		// },
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
		// {
		// 	title: 'Income',
		// 	dataIndex: 'compensation',
		// 	key: 'compensation',
		// align: 'center',
		// 	render: (_, record) => (
		// 		<Space size="middle">
		// 			{Number(record.compensation) < 99.9 ? 0 : Number(record.compensation) / 100000000}
		// 		</Space>
		// 	),
		// },
		{
			title: 'View Transaction',
			key: 'txhash',
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
						// disabled={!record.unlockable}
					}}  >unlock</Button>}
				</div>
			),
		},
	];

	// get row open url
	const getHash = async (txHash: string) => {
		window.open(`${BROWSERURL.test}/transaction/${txHash}`)
	}

	const withdraw = async (daoData: DaoDataObject) => {

		setLoading(true)
		// @ts-ignore
		const hash = await withdrawOrUnlock(daoData);

		if (hash) {
			notification["success"]({
				message: 'success',
				description:
					"success transaction",
			});
		};

		setTxHash(hash)
		setLoading(false)
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

	const cycleRequestFullCells = async (cursor: string) => {
		const nexusWallet = await nexus.connect();
		const fullCellsCursor = (await nexusWallet.fullOwnership.getLiveCells({ cursor: cursor }));

		setFullCells([...fullCells, ...fullCellsCursor.objects])

		if (fullCellsCursor.objects.length < 20) {
			clearInterval(timercCursor)
		} else {
			setLastCursor(fullCellsCursor.cursor)
		}
	}

	const getFullCells = async () => {
		const nexusWallet = await nexus.connect();

		const cells = await nexusWallet.fullOwnership.getLiveCells({});
		setFullCells(cells.objects)
		setLastCursor(cells.cursor)

	}

	// get table data
	const getTableData = async () => {

		// @ts-ignore
		const res = await getUnlockableAmountsFromCells(fullCells)

		let DaoBalance = 0
		let Income = 0

		for (let i = 0; i < res.length; i++) {
			// const transaction = await HTTPRPC.getTransaction(res[i].txHash);
			res[i].state = "success"
			// res[i].timestamp = formatDate(parseInt(transaction.header.timestamp))
			DaoBalance += Number(res[i].amount)
			Income += Number(res[i].compensation)
		}

		setTableData(res.reverse());
	};

	useEffect(() => {
		if (lastCursor) {
			clearInterval(timercCursor)
			timercCursor = setInterval(() => {
				cycleRequestFullCells(lastCursor)
			}, 200);
		}
	}, [lastCursor])


	useEffect(() => {
		if (fullCells) {
			getTableData()
		}
	}, [fullCells])


	useEffect(() => {
		if (connectWallet) {
			getFullCells()
		}
		// }, [connectWallet, balance])
	}, [connectWallet])



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


	return (
		<div className='transactionsTable'>
			<Spin spinning={loading}>
				<Table rowKey={record => record.txHash}
					columns={columns} dataSource={tableData} />
			</Spin>
			{/* <Button onClick={getTableData} className='button' type="primary">next</Button> */}
		</div>
	)
}

export default TransactionsTable;
