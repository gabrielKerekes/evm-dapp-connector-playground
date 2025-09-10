export const erc20Abi = [
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function totalSupply() public view returns (uint256)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function transfer(address _to, uint256 _value) public returns (bool success)",
];

export type NetworkParams = {
  chainId: string;
  rpcUrls: string[];
  chainName: string;
  nativeCurrency: {
    name: string;
    decimals: number;
    symbol: string;
  };
  blockExplorerUrls: string[];
  iconUrls: string[];
  usdcAddress: string;
};

export const chainPresets = {
  ethereum: {
    chainId: "0x1",
    rpcUrls: ["https://eth.llamarpc.com"],
    chainName: "Ethereum",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://etherscan.io"],
    iconUrls: [],
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  "eth-sepolia": {
    chainId: "0xaa36a7",
    rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
    chainName: "Ethereum - Sepolia",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    iconUrls: [],
    usdcAddress: "0xf08A50178dfcDe18524640EA6618a1f965821715",
  },
  arbitrumOne: {
    chainId: "0xa4b1",
    rpcUrls: ["https://arbitrum.llamarpc.com"],
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://arbiscan.io"],
    iconUrls: [],
    usdcAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  },
  polygon: {
    chainId: "0x89",
    rpcUrls: ["https://1rpc.io/matic"],
    chainName: "Polygon",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://polygonscan.com/"],
    iconUrls: [],
    usdcAddress: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  },
  avalancheCChain: {
    chainId: "0xa86a",
    rpcUrls: ["https://1rpc.io/avax/c"],
    chainName: "Avalanche C-Chain",
    nativeCurrency: {
      name: "AVAX",
      decimals: 18,
      symbol: "AVAX",
    },
    blockExplorerUrls: ["https://snowscan.xyz"],
    iconUrls: [],
    usdcAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  },
  linea: {
    chainId: "0xe708",
    rpcUrls: ["https://1rpc.io/linea"],
    chainName: "Linea",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://lineascan.build/"],
    iconUrls: [],
    usdcAddress: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
  },
  blast: {
    chainId: "0x13e31",
    rpcUrls: ["https://rpc.blast.io"],
    chainName: "Blast",
    nativeCurrency: {
      name: "BLAST",
      decimals: 18,
      symbol: "BLAST",
    },
    blockExplorerUrls: ["https://blastscan.io"],
    iconUrls: [],
    usdcAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  },
  unichain: {
    chainId: "0x82",
    rpcUrls: ["https://unichain.drpc.org"],
    chainName: "Unichain",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://unichain.blockscout.com"],
    iconUrls: [],
    usdcAddress: "0x078D782b760474a361dDA0AF3839290b0EF57AD6",
  },
  berachain: {
    chainId: "0x138de",
    rpcUrls: ["https://berachain.drpc.org"],
    chainName: "Berachain",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://berascan.com"],
    iconUrls: [],
    usdcAddress: "0x549943e04f40284185054145c6e4e9568c1d3241",
  },
  abstract: {
    chainId: "0xab5",
    rpcUrls: ["https://api.mainnet.abs.xyz"],
    chainName: "Abstract",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://abscan.org"],
    iconUrls: [],
    usdcAddress: "0x84a71ccd554cc1b02749b35d22f684cc8ec987e1",
  },
  optimism: {
    chainId: "0xa",
    rpcUrls: ["https://1rpc.io/op"],
    chainName: "Optimism",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    iconUrls: [],
    usdcAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  },
  base: {
    chainId: "0x2105",
    rpcUrls: ["https://base.llamarpc.com"],
    chainName: "Base",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://basescan.org"],
    iconUrls: [],
    usdcAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  },
  binanceSmartChain: {
    chainId: "0x38",
    rpcUrls: ["https://binance.llamarpc.com"],
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "BNB",
      decimals: 18,
      symbol: "BNB",
    },
    blockExplorerUrls: ["https://bscscan.com"],
    iconUrls: [],
    usdcAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  },
  mode: {
    chainId: "0x868b",
    rpcUrls: ["https://1rpc.io/mode"],
    chainName: "Mode",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://explorer.mode.network"],
    iconUrls: [],
    usdcAddress: "0xd988097fb8612cc24eeC14542bC03424c656005f",
  },
  bahamut: {
    chainId: "0x142d",
    rpcUrls: ["https://rpc1.bahamut.io"],
    chainName: "Bahamut",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "FTN",
    },
    blockExplorerUrls: ["https://www.ftnscan.com"],
    iconUrls: [],
    usdcAddress: "0x4237e0A5b55233D5B6D6d1D9BF421723954130D8",
  },
  mantle: {
    chainId: "0x1388",
    rpcUrls: ["https://rpc.mantle.xyz"],
    chainName: "Mantle",
    nativeCurrency: {
      name: "MNT",
      decimals: 18,
      symbol: "MNT",
    },
    blockExplorerUrls: ["https://explorer.mantle.xyz"],
    iconUrls: [],
    usdcAddress: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
  },
  flowEvm: {
    chainId: "0x2EB",
    rpcUrls: ["https://mainnet.evm.nodes.onflow.org"],
    chainName: "Flow EVM",
    nativeCurrency: {
      name: "FLOW",
      decimals: 18,
      symbol: "FLOW",
    },
    blockExplorerUrls: ["https://evm.flowscan.io"],
    iconUrls: [],
    usdcAddress: "0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52",
  },
} as const satisfies Record<string, NetworkParams>;
