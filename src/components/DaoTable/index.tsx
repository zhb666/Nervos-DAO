import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import { useQuery } from '@tanstack/react-query'
import { Space, Table, Button, notification, Spin } from 'antd';
import { DaoDataObject } from "../../type"
import { cutValue, formatDate, shannonToCKBFormatter } from "../../utils/index"
import { BROWSERURL, HTTPRPC } from "../../config"
import { UserStore } from "../../stores";
import { getUnlockableAmountsFromCells, withdrawOrUnlock } from "../../wallet"

import './index.css';
import nexus from '../../nexus';
import { BI, Cell } from '@ckb-lumos/lumos';

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


const TransactionsTable: React.FC<Props> = ({
	item,
	off
}) => {
	const UserStoreHox = UserStore();
	const { connectWallet } = UserStoreHox;
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
					openBrowserUrl(record.txHash)
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

	const openBrowserUrl = async (txHash: string) => {
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

	const getFullCells = async () => {
		// if (!connectWallet) return
		const nexusWallet = await nexus.connect();
		const fullCells: Cell[] = [];

		const fetchLiveCells = async (cursor?: string) => {
			const result = await nexusWallet.fullOwnership.getLiveCells({ cursor });
			fullCells.push(...result.objects);
			return result;
		};

		const firstResult = await fetchLiveCells();
		const cursorList = Array.from({ length: Math.ceil(firstResult.total / firstResult.limit) - 1 }, (_, i) => firstResult.objects[19 + i * 20]?.id);

		await Promise.all(cursorList.map((cursor) => fetchLiveCells(cursor)));

		getTableData(fullCells)

		return fullCells
	}


	const getTableData = async (fullCells: Cell[]) => {
		const res = await getUnlockableAmountsFromCells(fullCells)
		let DaoBalance = 0
		let Income = 0

		for (let i = 0; i < res.length; i++) {
			res[i].state = "success"
			DaoBalance += Number(res[i].amount)
			Income += Number(res[i].compensation)
		}

		setTableData(res.reverse());
	};

	const fullCells = useQuery(["data"], () => getFullCells(), {
		refetchInterval: 3000
	})


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
