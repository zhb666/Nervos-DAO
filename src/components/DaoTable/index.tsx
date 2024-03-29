import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import { Space, Table, Button, notification, Spin } from 'antd';
import { DaoDataObject } from "../../type"
import { cutValue, openBrowserUrl, shannonToCKBFormatter } from "../../utils/index"
import { getUnlockableAmountsFromCells, withdrawOrUnlock } from "../../wallet"

import './index.css';
import { BI, Cell } from '@ckb-lumos/lumos';

declare const window: {
	localStorage: {
		getItem: Function;
		setItem: Function;
	};
	open: Function
};

interface Props {
	fullCells: Cell[]
}

const TransactionsTable: React.FC<Props> = ({
	fullCells
}) => {
	const [tableData, setTableData] = useState<DaoDataObject[]>([])
	const [loading, setLoading] = useState(false);

	const columns: ColumnsType<DaoDataObject> = [
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			align: 'center',
			render: (_, record) => (
				<Space size="middle">
					{shannonToCKBFormatter(Number(record.amount).toString(), false, '')}
				</Space>
			),
		},
		{
			title: 'View Transaction',
			key: 'txhash',
			align: 'center',
			render: (_, record) => (
				<Space size="middle" onClick={() => {
					openBrowserUrl(record.txHash, "transaction")
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
					}}>withdraw</Button> : <Button className='actionButton' disabled={!record.unlockable} onClick={() => {
						withdraw(record)
					}}  >unlock</Button>}
				</div>
			),
		},
	];

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

		setLoading(false)
	}

	const getTableData = async (fullCells: Cell[]) => {
		setLoading(true)
		const res = await getUnlockableAmountsFromCells(fullCells)
		let DaoBalance = 0
		let Income = 0

		for (let i = 0; i < res.length; i++) {
			res[i].state = "success"
			DaoBalance += Number(res[i].amount)
			Income += Number(res[i].compensation)
		}

		setTableData(res.reverse());
		setLoading(false)
	};

	useEffect(() => {
		if (fullCells.length) {
			getTableData(fullCells)
		}
	}, [fullCells])


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
