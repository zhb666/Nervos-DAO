import React, { useEffect, useState } from "react";
import { BI, Cell } from '@ckb-lumos/lumos';
import { Button, Input, notification } from 'antd';
import { deposit as daoDeposit } from "../../wallet";
import { useQuery } from '@tanstack/react-query'
import { shannonToCKBFormatter } from '../../utils';
import { DAOCELLSIZE, BROWSERURL } from '../../config';
import { UserStore } from "../../stores";
import Table from '../../components/DaoTable'
import nexus from '../../nexus';
import "./index.css";

const Home: React.FC = () => {
    const UserStoreHox = UserStore();
    const { connectWallet, addWalletList } = UserStoreHox;
    const [balance, setBalance] = useState("");
    const [amount, setAmount] = useState<any>("");
    const [txHash, setTxHash] = useState<any>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [off, setOff] = useState(true);//pending = false  success = true

    const Deposit = async () => {

        let msg = ""
        if (!amount) {
            msg = "Deposit ckb cannot be 0"
        }

        if (BigInt(amount * 10 ** 8) < DAOCELLSIZE) {
            msg = "Minimum cannot be less than 102 CKB"
        }

        if (msg) {
            notification["error"]({
                message: 'error',
                description: msg
            });
            return
        }

        setLoading(true)

        const txhash = await daoDeposit(BigInt(amount), 1000);
        setLoading(false)
        setOff(false)
        setTxHash(txhash)
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
        refetchInterval: 5000,
    })

    return (
        <div className='mian'>
            <h3>Account</h3>
            <ul className='address'>
                <li>Total CKB : {connectWallet ? shannonToCKBFormatter(balance, false, '') : "Please connect Nexus Wallet"}</li>
            </ul>
            <h3 className='h3'>Amount </h3>
            <Input
                id="amount"
                type="text"
                autoComplete="off"
                disabled={!connectWallet}
                placeholder='Please enter the amount at least 102 CKB'
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
                    </Button> : <Button className='sendButton' disabled={loading} type="primary" block onClick={Deposit}>
                        Deposit
                    </Button>
            }

            {txHash ? <p className='txHash'>Transaction Hash : <a target="_blank" href={`${BROWSERURL.test}/transaction/${txHash}`}>{txHash}</a></p> : null}

            <div className="Table">
                <Table item={txHash} off={off} />
            </div>
        </div>
    )
}

export default Home


