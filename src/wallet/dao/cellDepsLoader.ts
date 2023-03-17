import { ScriptConfig } from "@ckb-lumos/config-manager/lib/types";
import { config, helpers } from "@ckb-lumos/lumos";

type OnchainScriptConfig = {
  DAO: ScriptConfig;
  SECP256K1_BLAKE160: ScriptConfig;
};

export async function appendScriptDeps({
  nodeUrl,
  txSkeleton,
}: {
  nodeUrl: string;
  txSkeleton: helpers.TransactionSkeletonType;
}): Promise<helpers.TransactionSkeletonType> {
  const { DAO, SECP256K1_BLAKE160 } = await loadScriptDeps({ nodeUrl });
  return txSkeleton.update("cellDeps", (cellDeps) => {
    // TODO: check if the dep is already in cellDeps
    return cellDeps.concat(
      {
        outPoint: {
          txHash: DAO.TX_HASH,
          index: DAO.INDEX,
        },
        depType: DAO.DEP_TYPE,
      },
      {
        outPoint: {
          txHash: SECP256K1_BLAKE160.TX_HASH,
          index: SECP256K1_BLAKE160.INDEX,
        },
        depType: SECP256K1_BLAKE160.DEP_TYPE,
      }
    );
  });
}

export async function loadScriptDeps(payload: {
  nodeUrl: string;
}): Promise<OnchainScriptConfig> {
  const rawResult = await fetch(payload.nodeUrl, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: 2,
      jsonrpc: "2.0",
      method: "get_block_by_number",
      params: ["0x0"],
    }),
    method: "POST",
  });
  const genesisBlock = (await rawResult.json()).result;
  if (!genesisBlock) throw new Error("can't load genesis block");
  const daoDepTxHash = genesisBlock.transactions[0].hash;
  const secp256k1DepTxHash = genesisBlock.transactions[1].hash;

  const secp256k1TypeHash =
    config.predefined.AGGRON4.SCRIPTS.SECP256K1_BLAKE160.CODE_HASH;
  const daoTypeHash = config.predefined.AGGRON4.SCRIPTS.DAO.CODE_HASH;

  const DAO: ScriptConfig = {
    HASH_TYPE: "type",
    CODE_HASH: daoTypeHash,
    INDEX: "0x2",
    TX_HASH: daoDepTxHash,
    DEP_TYPE: "code",
  };
  const SECP256K1_BLAKE160: ScriptConfig = {
    HASH_TYPE: "type",
    CODE_HASH: secp256k1TypeHash,
    INDEX: "0x0",
    TX_HASH: secp256k1DepTxHash,
    DEP_TYPE: "depGroup",
  };
  return {
    DAO,
    SECP256K1_BLAKE160,
  };
}
