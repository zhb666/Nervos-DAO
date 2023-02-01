import React, { useEffect, useState } from "react";
import { capacityOf, deposit as daoDeposit } from "../../wallet";

import "./index.css";

const Home: React.FC = () => {

    const deposit = async () => {
        const txhash = await daoDeposit(BigInt(166 * 10 ** 8), 1000);
        console.log(txhash);
    }

    return (
        <div>Home
            <button onClick={deposit}>发送b a</button>
        </div>
    )
}

export default Home
