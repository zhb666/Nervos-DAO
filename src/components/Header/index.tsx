import React, { useEffect, useState } from "react";
import { Button, Input } from 'antd';
import { UserStore } from "../../stores";
import { address } from '../../config';
import { cutValue } from '../../utils';
import nexus from "../../nexus"

import "./index.css";
import { log } from 'console';

const Header: React.FC = () => {
    const UserStoreHox = UserStore();
    const { addWalletList, connectWallet } = UserStoreHox;
    const connectWalletFun = async () => {
        let nexusWallet: any
        setTimeout(async () => {
            nexusWallet = await nexus.connect();
            const getOffChainLocks = await nexusWallet.fullOwnership.getOffChainLocks({});
            console.log(getOffChainLocks);
            addWalletList(true)
        }, 500)
    }

    useEffect(() => {
        // if (connectWallet) {
        connectWalletFun()
        // }
    }, [])

    return (
        <div className='Header'>
            Nervos-Dao
            <Button type="primary" className='connectWallet' onClick={connectWalletFun}>
                {/* {connectWallet ? cutValue(address, 8, 8) : "ConnectWallet"} */}
                {connectWallet ? "我的钱包" : "ConnectWallet"}
            </Button>
        </div>
    )
}

export default Header
