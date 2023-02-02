/*
 * @Author: zouxionglin
 * @Description: stores
 */
import { useState } from "react";
import { createModel } from "hox";

function useCounter() {
  const [connectWallet, setConnectWallet] = useState<boolean>(false);

  const addWalletList = (value: boolean) => {
    setConnectWallet(value);
  }

  return {
    connectWallet,
  };
}

export default createModel(useCounter);
