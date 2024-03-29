import React, { useEffect, useState } from "react";
import { BrowserRouter, HashRouter, Link } from 'react-router-dom'
import { Button } from 'antd';
import { UserStore } from "../../stores";
import nexus from "../../nexus"

import "./index.css";

const Header: React.FC = () => {
    const UserStoreHox = UserStore();
    const { addWalletList, connectWallet } = UserStoreHox;
    const connectWalletFun = async () => {
        setTimeout(async () => {
            const res = await nexus.connect();
            if (res) {
                addWalletList(true)
            }
        }, 500)
    }

    useEffect(() => {
        connectWalletFun()
    }, [])

    return (
        <div className='Header'>
            <p className='logo'>Nervos-Dao</p>

            <ul className='link'>
                <li>
                    <Link to="/">Dao</Link>
                </li>
                <li>
                    <Link to="/transfer">Transfer</Link>
                </li>
                <li>
                    <Link to="/addressBook">Address Book</Link>
                </li>
            </ul>

            <Button type="primary" className='connectWallet' onClick={connectWalletFun}>
                {connectWallet ? "我的钱包" : "ConnectWallet"}
            </Button>
        </div>
    )
}

export default Header
