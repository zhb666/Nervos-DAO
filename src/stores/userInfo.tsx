/*
 * @Author: zouxionglin
 * @Description: stores
 */
import { useState } from "react";
import { createModel } from "hox";

function useCounter() {
  const [connectWallet, setConnectWallet] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");

  const addWalletList = (value: boolean) => {
    setConnectWallet(value);
  }

  const changeBalance = (value: string) => {
    setBalance(value);
  }

  return {
    addWalletList,
    connectWallet,
    balance,
    changeBalance
  };
}

export default createModel(useCounter);
