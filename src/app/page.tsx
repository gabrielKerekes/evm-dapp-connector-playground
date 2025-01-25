"use client";

import { ethers } from "ethers";
import { useState } from "react";

const getProvider = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).ethereum;
};

const abi = [
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function totalSupply() public view returns (uint256)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
];

const chainPresets = {
  arbitrumOne: {
    chainId: "0xa4b1",
    rpcUrls: ["https://arbitrum.llamarpc.com"],
    chainName: "Arbitrum One",
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    blockExplorerUrls: ["https://arbiscan.io/"],
    iconUrls: [],
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
    blockExplorerUrls: ["https://explorer.mode.network/"],
    iconUrls: [],
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
    blockExplorerUrls: ["https://www.ftnscan.com/"],
    iconUrls: [],
  },
};

export default function Home() {
  const [networkParams, setNetworkParams] = useState(chainPresets.arbitrumOne);
  const [result, setResult] = useState<any>(null);

  const [eventsEmitted, setEventsEmitted] = useState<any[]>([]);

  const onChainChanged = (message: any) => {
    console.log("chainChanged", { message });
    setEventsEmitted((prev) => [
      ...prev,
      {
        type: "chainChanged",
        message,
        chainName: Object.values(chainPresets).find(
          (chainData) => chainData.chainId === message
        )?.chainName,
      },
    ]);
  };

  const onAccountsChanged = (message: any) => {
    console.log("accountsChanged", { message });
    setEventsEmitted((prev) => [...prev, { type: "accountsChanged", message }]);
  };

  const onDisconnect = (message: any) => {
    console.log("disconnect", { message });
    setEventsEmitted((prev) => [...prev, { type: "disconnect", message }]);
  };

  const onConnect = (message: any) => {
    console.log("connect", { message });
    setEventsEmitted((prev) => [...prev, { type: "connect", message }]);
  };

  const connect = async () => {
    const provider = getProvider();
    if (provider) {
      provider.removeListener("chainChanged", onChainChanged);
      provider.removeListener("accountsChanged", onAccountsChanged);
      provider.removeListener("disconnect", onDisconnect);
      provider.removeListener("connect", onConnect);
    }

    provider.enable();

    provider.on("chainChanged", onChainChanged);
    provider.on("accountsChanged", onAccountsChanged);
    provider.on("disconnect", onDisconnect);
    provider.on("connect", onConnect);

    setResult("Connected");
  };

  const getAccounts = async () => {
    const accounts = await getProvider().request({
      method: "eth_requestAccounts",
    });
    setResult(accounts);
    return accounts;
  };
  const switchNetwork = async () => {
    try {
      const result = await getProvider().request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkParams.chainId }],
      });
      setResult(result);
    } catch (error) {
      console.log(error);
      // https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_switchethereumchain/
      if (error.code === 4902) {
        console.log("chain not found, adding network");
        await addNetwork();
      } else {
        setResult(error);
        throw error;
      }
    }
  };
  // todo test what happens with metamask if some data are not defined
  const addNetwork = async () => {
    const result = await getProvider().request({
      method: "wallet_addEthereumChain",
      params: [networkParams],
    });
    setResult(result);
  };

  const approve = async () => {
    const provider = new ethers.BrowserProvider(await getProvider());
    const address = (await getAccounts())![0];
    const signer = new ethers.JsonRpcSigner(provider, address);
    console.log({ provider, address, signer });
    const contract = new ethers.Contract(
      "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      abi,
      signer
    );
    // const ctr = await contract.connect(provider);

    const result = await contract.approve(address, 1000);

    console.log({ provider, address, contract, result });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Chain params</h3>
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) =>
                setNetworkParams(
                  chainPresets[e.target.value as keyof typeof chainPresets]
                )
              }
              defaultValue={networkParams.chainName}
            >
              {Object.keys(chainPresets).map((chain) => (
                <option key={chain} value={chain}>
                  {chainPresets[chain].chainName}
                </option>
              ))}
            </select>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              value={networkParams.chainId}
              onChange={(e) =>
                setNetworkParams({ ...networkParams, chainId: e.target.value })
              }
            />
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              value={networkParams.rpcUrls}
              onChange={(e) =>
                setNetworkParams({
                  ...networkParams,
                  rpcUrls: [e.target.value],
                })
              }
            />
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              value={networkParams.chainName}
              onChange={(e) =>
                setNetworkParams({
                  ...networkParams,
                  chainName: e.target.value,
                })
              }
            />
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="text"
              value={networkParams.blockExplorerUrls}
              onChange={(e) =>
                setNetworkParams({
                  ...networkParams,
                  blockExplorerUrls: [e.target.value],
                })
              }
            />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Actions</h3>

            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() => connect()}
            >
              Connect
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() => getAccounts()}
            >
              Get Accounts
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() => switchNetwork()}
            >
              Switch Network
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() => addNetwork()}
            >
              Add Network
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() => approve()}
            >
              Approve
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Events Emitted</h3>
            <div className="flex flex-col gap-2">
              {eventsEmitted.map((event, index) => (
                <div key={index}>
                  {event.type}: {event.message}{" "}
                  {event.chainName ? `(${event.chainName})` : ""}
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold">Result: {JSON.stringify(result)}</h3>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
