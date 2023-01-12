import { Script, Transaction } from '@ckb-lumos/lumos'
import { TransactionSkeletonType } from "@ckb-lumos/helpers";
import {signTransaction} from "../wallet"

const owership = {
    getLiveCells() { 
        return Promise.resolve({
            "objects": [
                {
                    "cell_output": {
                        "capacity": "0x174876e800",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": {
                            "args": "0x",
                            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                            "hash_type": "type"
                        }
                    },
                    "data": "0x0000000000000000",
                    "out_point": {
                        "index": "0x0",
                        "tx_hash": "0x8fcbd905d578032e1cca1638c0f1e7fb64230254954ee99428db141150002ab9"
                    },
                    "block_number": "0x5fe32d"
                },
                {
                    "cell_output": {
                        "capacity": "0x277cf2a00",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": {
                            "args": "0x",
                            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                            "hash_type": "type"
                        }
                    },
                    "data": "0x0000000000000000",
                    "out_point": {
                        "index": "0x0",
                        "tx_hash": "0x3d9075de60200689507f8c389be6101b1d4496ba9ef0a6b272ba37fd24f3a24b"
                    },
                    "block_number": "0x5fe340"
                },
                {
                    "cell_output": {
                        "capacity": "0x1e449a9400",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": {
                            "args": "0x",
                            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                            "hash_type": "type"
                        }
                    },
                    "data": "0x0000000000000000",
                    "out_point": {
                        "index": "0x0",
                        "tx_hash": "0xb4e21776b819832069be61da7cb3679b701a71e540446b00ede54aae0058ae92"
                    },
                    "block_number": "0x5fe36c"
                },
                {
                    "cell_output": {
                        "capacity": "0x174876e800",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": {
                            "args": "0x",
                            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                            "hash_type": "type"
                        }
                    },
                    "data": "0x0000000000000000",
                    "out_point": {
                        "index": "0x0",
                        "tx_hash": "0xad594a01bb6c4ec745980e883cce9a06b67cd0ac64d5db1019fee53710dd1790"
                    },
                    "block_number": "0x78cfca"
                },
                {
                    "cell_output": {
                        "capacity": "0x3dd6fe600",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": {
                            "args": "0x",
                            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                            "hash_type": "type"
                        }
                    },
                    "data": "0x0000000000000000",
                    "out_point": {
                        "index": "0x0",
                        "tx_hash": "0x34adc531392e0cc29c76d1414d7d10cfeeda73d1130697c26ee1926ac8511e72"
                    },
                    "block_number": "0x78d021"
                },
                {
                    "cell_output": {
                        "capacity": "0x3dd6fe600",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": {
                            "args": "0x",
                            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                            "hash_type": "type"
                        }
                    },
                    "data": "0x0000000000000000",
                    "out_point": {
                        "index": "0x0",
                        "tx_hash": "0x7c1a005e77ee6e34748a6b55422570a11a3c52bf5ec86b29be14f86c39283a2c"
                    },
                    "block_number": "0x78f589"
                },
                {
                    "cell_output": {
                        "capacity": "0x454a57a00",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": {
                            "args": "0x",
                            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                            "hash_type": "type"
                        }
                    },
                    "data": "0x0000000000000000",
                    "out_point": {
                        "index": "0x0",
                        "tx_hash": "0x5238b1bb58625d0a4dd36d8f92cfad9ca20f5bb70492b9121b99a0ee15a0a98d"
                    },
                    "block_number": "0x78f5bd"
                },
                {
                    "cell_output": {
                        "capacity": "0x454a57a00",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": {
                            "args": "0x",
                            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                            "hash_type": "type"
                        }
                    },
                    "data": "0x0000000000000000",
                    "out_point": {
                        "index": "0x0",
                        "tx_hash": "0x61ff3afe9390be842f31a0085faa843ec74af93d1e9922e924e27135530df140"
                    },
                    "block_number": "0x78f5cc"
                },
                {
                    "cell_output": {
                        "capacity": "0x454a57a00",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": {
                            "args": "0x",
                            "code_hash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                            "hash_type": "type"
                        }
                    },
                    "data": "0x0000000000000000",
                    "out_point": {
                        "index": "0x0",
                        "tx_hash": "0x52d9704d0c7320947a2356ae22ec323538413934ef0015b388dd8f1570de2eb8"
                    },
                    "block_number": "0x794862"
                },
                {
                    "cell_output": {
                        "capacity": "0x8e720f20b8",
                        "lock": {
                            "args": "0x5989ae415bb667931a99896e5fbbfad9ba53a223",
                            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                            "hash_type": "type"
                        },
                        "type": null
                    },
                    "data": "0x",
                    "out_point": {
                        "index": "0x1",
                        "tx_hash": "0x52d9704d0c7320947a2356ae22ec323538413934ef0015b388dd8f1570de2eb8"
                    },
                    "block_number": "0x794862"
                }
            ],
            "lastCursor": "0x209bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8015989ae415bb667931a99896e5fbbfad9ba53a22300000000007948620000000600000001"
        })
    },
    getUnusedLocks(): Promise<Script> {return Promise.resolve({
        codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        hashType: "type",
        args: "0x5989ae415bb667931a99896e5fbbfad9ba53a223"
    })},
   async signTransaction(txSkeleton: TransactionSkeletonType,
        privateKeys: string[]): Promise<Transaction> { 
          return  Promise.resolve(await signTransaction(txSkeleton,privateKeys))
        },
}

export default owership
