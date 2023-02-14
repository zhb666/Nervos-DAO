import { Script } from '@ckb-lumos/lumos'

const cells = {
    "objects": [
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x2bf55b600",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xc87a034198e9a2a46830b3f3dcf4a43c7e6971630eb11f96a1f23e1f198e287b"
            },
            "blockNumber": "0x5c81d1"
        },
        {
            "data": "0xb16f5c0000000000",
            "cellOutput": {
                "capacity": "0x277cf2a00",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x8fcabeff91b24594165c851c51d01641127e6f118b0456efa2658b501da87a52"
            },
            "blockNumber": "0x5c837a"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x2bf55b600",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xb7babd28f60566f2a02e6cb183233c17c3befe25d4aa416a94b6633f4165e4b0"
            },
            "blockNumber": "0x5cab72"
        },
        {
            "data": "0xe31c5f0000000000",
            "cellOutput": {
                "capacity": "0x174876e800",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x80640da4af46d30b1b3a9f65799a2cea8dbd325c3fa7686f48a02502693c868b"
            },
            "blockNumber": "0x5f1cf1"
        },
        {
            "data": "0x58f05f0000000000",
            "cellOutput": {
                "capacity": "0x174876e800",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xe0adb13341043460b90ef8bc176776bf14a899737d20ea5f5a3589c49272f44b"
            },
            "blockNumber": "0x5ff064"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x17d7840000",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xa65ab2f0601829ce6c78fb35a6a136e54c5f0c7e5e5251cfd07d891b83465d7b"
            },
            "blockNumber": "0x6039ba"
        },
        {
            "data": "0x2fef5e0000000000",
            "cellOutput": {
                "capacity": "0x3dd6fe600",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xd1e6127f70910e4314b5ea6f5fb63bc241b952b80cb82f2fb14962720fbcea0e"
            },
            "blockNumber": "0x6039cf"
        },
        {
            "data": "0xe739600000000000",
            "cellOutput": {
                "capacity": "0x2dd231b00",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xc392d6380e41f8d79688ab66dbad5b53207c7d87dc3fdc7c543656f9c0422a60"
            },
            "blockNumber": "0x6039fd"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x360447100",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x28ce8a4fc3760a6d169ad24cafb9f2209451ebade01f6e20d90917c4bb0ca790"
            },
            "blockNumber": "0x603f40"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x2dd231b00",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xdc61a2af51ca7d2e9f6e4f41da6192cc4340a90317902ada9fb67ea934deaced"
            },
            "blockNumber": "0x604022"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x2959c8f00",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x10024f149d0bc0850b3f79e00fc7526d6da6109844f532ba58ecc32c1034e250"
            },
            "blockNumber": "0x6042ac"
        },
        {
            "data": "0xa065600000000000",
            "cellOutput": {
                "capacity": "0x460913c00",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x59934a04d7ba1dda3b5debb5bfb33df0d412639fe6962ee74c358def157990b5"
            },
            "blockNumber": "0x6065ac"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x2c54b9700",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x59a3ce9409223e8e8111d28dbd0e8cf9efa8a8b0b7189b96b03389ad424c77b0"
            },
            "blockNumber": "0x606861"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x460913c00",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x90b623718e7eca792838450ec9ea92c674be5185ed12329e6d54218f9712b20c"
            },
            "blockNumber": "0x606d24"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x2d72d3a00",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x8ff8dd5dcf1a2e9988d02760a0198afb921be20fa7aea087c53dca30d1e5c063"
            },
            "blockNumber": "0x606fbf"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x2d72d3a00",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x0ecfd94925f18dc0870cce3b0e3fc4cdf07f80dba24ca0e9702d624a8d8e2997"
            },
            "blockNumber": "0x6073a7"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x2ef04be00",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xf90073839de1b48d1e9f6a71bca0273d643d8d4510d3a2b6abfb06f3754047ba"
            },
            "blockNumber": "0x607593"
        },
        {
            "data": "0xb48b600000000000",
            "cellOutput": {
                "capacity": "0x3dd6fe600",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xa35c0c1ff0a03302597c425c3cc65fa7dabd4a3db905d0728bd8c51ce833f5d7"
            },
            "blockNumber": "0x608bd0"
        },
        {
            "data": "0xe78e600000000000",
            "cellOutput": {
                "capacity": "0x4a221e700",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x577ab016449827756d8eaaf431661d405e8215e8cfbab29ae3017b79a6b91b8e"
            },
            "blockNumber": "0x608ef2"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x49c2c0600",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0x94c687174b78d4ddc5e721b99550f85ab4760b5b9f65e2c9090579cb5e446068"
            },
            "blockNumber": "0x6f3570"
        },
        {
            "data": "0x0000000000000000",
            "cellOutput": {
                "capacity": "0x3dd6fe600",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xad50fb2b28ca671981e7a67f029e1452a4e6b8e2717430feff060bcaf11918b6"
            },
            "blockNumber": "0x6f35b7"
        },
        {
            "data": "0x04906f0000000000",
            "cellOutput": {
                "capacity": "0x4a221e700",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": {
                    "args": "0x",
                    "codeHash": "0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
                    "hashType": "type"
                }
            },
            "outPoint": {
                "index": "0x0",
                "txHash": "0xce12990335e2481726e848ec1640bc10237d3498e750ecd16b2446de0b52dcd0"
            },
            "blockNumber": "0x6f900c"
        },
        {
            "data": "0x",
            "cellOutput": {
                "capacity": "0x3fb3057448",
                "lock": {
                    "args": "0x836d68d06bc8f4712f774ba32552644df68e68f8",
                    "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType": "type"
                },
                "type": null
            },
            "outPoint": {
                "index": "0x1",
                "txHash": "0xce12990335e2481726e848ec1640bc10237d3498e750ecd16b2446de0b52dcd0"
            },
            "blockNumber": "0x6f900c"
        }
    ],
    "lastCursor": "0x209bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce801836d68d06bc8f4712f774ba32552644df68e68f800000000006f900c0000000100000001"
}

const script:Script = {
  codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  hashType: "type",
  args: "0x5989ae415bb667931a99896e5fbbfad9ba53a223"
}

export {cells,script}
