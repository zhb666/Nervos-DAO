import { Indexer } from "@ckb-lumos/ckb-indexer";
import { config, RPC, Script } from "@ckb-lumos/lumos";

interface BrowserUrl {
  test: string;
  mian: string;
}

const BROWSERURL: BrowserUrl = {
  test: "https://pudge.explorer.nervos.org",
  mian: "https://explorer.nervos.org"
};

// const TEST_CKB_RPC_URL = "http://localhost:8114";
// const TEST_CKB_INDEXER_URL = "http://localhost:8114";
const TEST_CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
const TEST_CKB_INDEXER_URL = "https://testnet.ckb.dev/indexer";

const HTTPRPC = new RPC(TEST_CKB_RPC_URL);
const TEST_INDEXER = new Indexer(TEST_CKB_INDEXER_URL, TEST_CKB_RPC_URL);

// AGGRON4 for test, LINA for main
const { AGGRON4, LINA } = config.predefined;
const RPC_NETWORK = AGGRON4;

const DAOCELLSIZE = BigInt(102 * 10 ** 8);
const TRANSFERCELLSIZE = BigInt(61 * 10 ** 8);
const DEPOSITDAODATA = "0x0000000000000000";
const DAOTYPE: Script = {
  "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
  "args": "0x",
  "hashType": "type"
}

export {
  TEST_CKB_RPC_URL,
  TEST_CKB_INDEXER_URL,
  TEST_INDEXER,
  AGGRON4,
  LINA,
  RPC_NETWORK,
  DAOCELLSIZE,
  DEPOSITDAODATA,
  TRANSFERCELLSIZE,
  HTTPRPC,
  BROWSERURL,
  DAOTYPE,
};
