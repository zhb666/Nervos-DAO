import React, { useEffect, useState } from "react";
import { Button, Input } from 'antd';

import "./index.css";

const Header: React.FC = () => {

    const connectWallet = async () => {

    }

    return (
        <div className='Header'>
            Nervos-Dao
            <Button type="primary" className='connectWallet' onClick={connectWallet}>
                ConnectWallet
            </Button>
        </div>
    )
}

export default Header
