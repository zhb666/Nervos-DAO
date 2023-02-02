import React, { useEffect, useState } from "react";
import { Button, Input } from 'antd';
import { UserStore } from "../../stores";
import { address } from '../../config';
import { cutValue } from '../../utils';

import "./index.css";

const Header: React.FC = () => {
    const UserStoreHox = UserStore();
    const { addWalletList, connectWallet } = UserStoreHox;
    const connectWalletFun = async () => {
        addWalletList(true)
    }

    return (
        <div className='Header'>
            Nervos-Dao
            <Button type="primary" className='connectWallet' onClick={connectWalletFun}>
                {connectWallet ? cutValue(address, 8, 8) : "ConnectWallet"}
            </Button>
        </div>
    )
}

export default Header
