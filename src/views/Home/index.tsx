import React, { useEffect, useState } from "react";
import { Script } from '@ckb-lumos/lumos';
import { Button, Input } from 'antd';
import { capacityOf, deposit as daoDeposit } from "../../wallet";

import "./index.css";
import { cutValue } from '../../utils';
import { address, privateKey } from '../../config';
import { minus } from '../../utils/bigNumber';

const Home: React.FC = () => {

    const [privKey, setPrivKey] = useState(privateKey);
    const [fromAddr, setFromAddr] = useState(address);
    const [fromLock, setFromLock] = useState<Script>();
    const [balance, setBalance] = useState("");
    const [amount, setAmount] = useState<any>("");
    const [txHash, setTxHash] = useState<any>("11111");

    const deposit = async () => {
        const txhash = await daoDeposit(BigInt(166 * 10 ** 8), 1000);
        setTxHash(setTxHash)
        console.log(txhash);
    }

    const capacity = async () => {
        const capacity = await capacityOf();
        setBalance(capacity.toString())
        // console.log(Number(capacity.toString())/ 100000000);
    }

    const updateFromInfo = async () => {
        const capacity = await capacityOf();
        setBalance(capacity.toString());
    };

    useEffect(() => {
        if (privKey) {
            updateFromInfo();
        }
    }, [privKey]);

    return (
        <div className='mian'>
            <h3>Account</h3>
            <ul className='address'>
                <li>Address : {cutValue(fromAddr, 20, 20)}</li>
                <li>Total CKB : {Number(balance) / 100000000}</li>
            </ul>
            <h3 className='h3'>Amount </h3>
            <Input
                id="amount"
                type="text"
                autoComplete="off"
                placeholder='Please enter the amount at least 102 CKB'
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            />
            <br />
            <Button className='sendButton' type="primary" block onClick={deposit}>
                Deposit
            </Button>
            {txHash ? <p className='txHash'>Transaction Hash : <a href="">{txHash}</a></p> : null}

            {/* {
                off ?
                    <Button className='sendButton' type="primary" block onClick={Deposit}>
                        Deposit
                    </Button> :
                    <Button type="primary" block disabled>需要等上一笔上链成功才能发送交易</Button>
            } */}



            <div className="Table">
                {/* <Table item={txHash} off={off} /> */}
            </div>
        </div>
    )
}

export default Home
