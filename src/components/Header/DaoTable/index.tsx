import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import { Space, Table, Button, notification, Spin } from 'antd';

import './index.css';

let timer: any = null

const TransactionsTable: React.FC = () => {
	const columns: ColumnsType<DaoDataObject> = [
		{
			title: 'Date',
			dataIndex: 'timestamp',
			key: 'timestamp',
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			render: (_, record) => (
				<Space size="middle">
					{Number(record.amount) / 100000000}
				</Space>
			),
		},
		{
			title: 'Income',
			dataIndex: 'compensation',
			key: 'compensation',
			render: (_, record) => (
				<Space size="middle">
					{Number(record.compensation) < 99.9 ? 0 : Number(record.compensation) / 100000000}
				</Space>
			),
		},
		{
			title: 'View Transaction',
			key: 'tx_index',
			render: (_, record) => (
				<Space size="middle" onClick={() => {
					getHash(record.txHash)
				}}>
				</Space>
			),
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
		},
		{
			title: 'State',
			dataIndex: 'state',
			key: 'state',
		},
		{
			title: 'Action',
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





	useEffect(() => {

	}, [])




	return (
		<div className='transactionsTable'>
			<Spin spinning={loading}>
				<Table rowKey={record => record.txHash}
					// onRow={record => {
					// 	return {
					// 		onClick: event => { getHash(record) },
					// 	};
					// }}
					columns={columns} dataSource={tableData} />
			</Spin>
			{/* <Button onClick={getTableData} className='button' type="primary">next</Button> */}
		</div>
	)
}

export default TransactionsTable;
