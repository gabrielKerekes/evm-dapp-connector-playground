export const erc20Abi = [
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function totalSupply() public view returns (uint256)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
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
    blockExplorerUrls: ["https://etherescan.io"],
    iconUrls: [],
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
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
} as const satisfies Record<string, NetworkParams>;
