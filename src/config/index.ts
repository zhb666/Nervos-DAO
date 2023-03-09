import { Indexer } from "@ckb-lumos/ckb-indexer";
import { config, RPC } from "@ckb-lumos/lumos";

interface BrowserUrl {
  test: string;
  mian: string;
}

const BROWSERURL: BrowserUrl = {
  test: "https://pudge.explorer.nervos.org",
  mian: "https://explorer.nervos.org"
};

let privateKey = "0xc05124858c866687526b67340fbd9527c71cbf3092191af406b6d9ae81d5a2aa"
let address = "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqvrd45dq67g73cj7a6t5vj4yezd768x37qnefkjm"

const TEST_CKB_RPC_URL = "http://127.0.0.1:8114/rpc";
const TEST_CKB_INDEXER_URL = "http://127.0.0.1:8114/indexer";
// const TEST_CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
// const TEST_CKB_INDEXER_URL = "https://testnet.ckb.dev/indexer";
const HTTPRPC = new RPC(TEST_CKB_RPC_URL);
const TEST_INDEXER = new Indexer(TEST_CKB_INDEXER_URL, TEST_CKB_RPC_URL);

// AGGRON4 for test, LINA for main
const { AGGRON4, LINA } = config.predefined;
const RPC_NETWORK = AGGRON4;

const DAOCELLSIZE = BigInt(102 * 10 ** 8);
const TRANSFERCELLSIZE = BigInt(61 * 10 ** 8);
const DEPOSITDAODATA = "0x0000000000000000";

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
  privateKey,
  address
};
