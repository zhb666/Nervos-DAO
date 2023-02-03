import React, { useEffect, useState } from "react";
import { Script } from '@ckb-lumos/lumos';
import { Button, Input, notification } from 'antd';
import { capacityOf, deposit as daoDeposit } from "../../wallet";

import "./index.css";
import { cutValue } from '../../utils';
import { address, DAOCELLSIZE, privateKey, BROWSERURL } from '../../config';
import { UserStore } from "../../stores";
import { minus } from '../../utils/bigNumber';

const Home: React.FC = () => {
    const UserStoreHox = UserStore();
    const { connectWallet, addWalletList } = UserStoreHox;
    const [privKey, setPrivKey] = useState(privateKey);
    const [fromAddr, setFromAddr] = useState(address);
    const [fromLock, setFromLock] = useState<Script>();
    const [balance, setBalance] = useState("");
    const [amount, setAmount] = useState<any>("");
    const [txHash, setTxHash] = useState<any>("");
    const [loading, setLoading] = useState<boolean>(false);

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

        const txhash = await daoDeposit(BigInt(amount * 10 ** 8), 1000);
        setLoading(false)
        setTxHash(txhash)
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
                <li>Address :  {connectWallet ? cutValue(fromAddr, 20, 20) : "Please connect nexus wallet"}</li>
                <li>Total CKB : {connectWallet ? Number(balance) / 100000000 : "Please connect nexus wallet"}</li>
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
                {/* <Table item={txHash} off={off} /> */}
            </div>
        </div>
    )
}

export default Home


