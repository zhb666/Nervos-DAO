import { Indexer } from "@ckb-lumos/ckb-indexer";
import { config, RPC } from "@ckb-lumos/lumos";

interface BrowserUrl {
  test: string;
  mian: string;
}

const browserUrl: BrowserUrl = {
  test: "https://pudge.explorer.nervos.org",
  mian: "https://explorer.nervos.org"
};

let privateKey = "0xfec836f11b8c718e15f6adc40fe64d4bcace158c78e6f9e7e30645f1669dff6d"
let address = "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq2e3xhyzkakv7f34xvfde0mh7kehff6ygcy2u3kz"

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
  browserUrl,
  privateKey,
  address
};
