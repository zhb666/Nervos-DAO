import { Script } from '@ckb-lumos/lumos'

const cells = {
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
                "capacity": "0x460913c00",
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
                "tx_hash": "0x6fce71f15e9deac756023060e2b7c6ba1019f6f3975609633dbf7e2eff0d9bb7"
            },
            "block_number": "0x79bd8d"
        },
        {
            "cell_output": {
                "capacity": "0x49c2c0600",
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
                "tx_hash": "0x5bff42e2ddfe1fdf9d373cfa4979a822d21464ea8c04bcc9e54468ec85213485"
            },
            "block_number": "0x79c8b3"
        },
        {
            "cell_output": {
                "capacity": "0x4d7c6d000",
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
                "tx_hash": "0x44928e96a867df3ed376719a7ff9cc3a289fc061fc0bc70e6a97a5be542acc88"
            },
            "block_number": "0x79c8d5"
        },
        {
            "cell_output": {
                "capacity": "0x4d7c6d000",
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
                "tx_hash": "0x1e2f224b7243dad33cd5513e194e3e14d5e3bfa7d8140ba65a66a7931dcab8ac"
            },
            "block_number": "0x79c8f8"
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
                "tx_hash": "0x5b139b3d60f4c7c94a7af1cfe2110b736f0e5cb815f4aa027bf0d18f50490f47"
            },
            "block_number": "0x79c9ae"
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
                "tx_hash": "0x51925a1af28afa91771c9f367e7febab36cf6e29c8900acc5c7b624009bbd930"
            },
            "block_number": "0x79e226"
        },
        {
            "cell_output": {
                "capacity": "0x740ae4658c",
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
                "tx_hash": "0x51925a1af28afa91771c9f367e7febab36cf6e29c8900acc5c7b624009bbd930"
            },
            "block_number": "0x79e226"
        }
    ],
    "lastCursor": "0x209bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8015989ae415bb667931a99896e5fbbfad9ba53a223000000000079e2260000000500000001"
}

const script:Script = {
  codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  hashType: "type",
  args: "0x5989ae415bb667931a99896e5fbbfad9ba53a223"
}

export {cells,script}
