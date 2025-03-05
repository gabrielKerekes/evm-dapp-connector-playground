"use client";

import { ethers } from "ethers";
import { useState } from "react";
import { chainPresets, erc20Abi, NetworkParams } from "./constants";
import { Button } from "./Button";
import { Input } from "./Input";
import { NetworkModal } from "./NetworkModal";
import { GithubIcon } from "./icons/GithubIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { NufiIcon } from "./icons/NufiIcon";

const getProvider = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).ethereum;
};

export default function Home() {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkParams>(
    chainPresets.ethereum
  );
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [approvalAmount, setApprovalAmount] = useState<string>("123");
  const [logs, setLogs] = useState<any[]>([]);
  const [connectedAccount, setConnectedAccount] = useState<string>("");

  const addLog = ({ type, message }: { type: string; message: any }) => {
    console.log("Log:", { type, message });
    setLogs((prev) => [...prev, { type, message }]);
  };

  const onChainChanged = (message: any) => {
    addLog({ type: "chainChanged", message });
  };

  const onAccountsChanged = (message: string) => {
    addLog({ type: "accountsChanged", message });
  };

  const onDisconnect = (message: string) => {
    addLog({ type: "disconnect", message });
  };

  const onConnect = (message: string) => {
    addLog({ type: "connect", message });
  };

  const connect = async () => {
    const provider = getProvider();
    if (provider) {
      provider.removeListener("chainChanged", onChainChanged);
      provider.removeListener("accountsChanged", onAccountsChanged);
      provider.removeListener("disconnect", onDisconnect);
      provider.removeListener("connect", onConnect);
    }

    await provider.enable();
    const accounts = await getAccounts();
    setConnectedAccount(accounts[0]);

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
    addLog({ type: "getAccounts", message: `accounts: ${accounts}` });
    setResult(accounts);
    setConnectedAccount(accounts[0]);
    return accounts;
  };

  const switchNetwork = async (networkParams: NetworkParams) => {
    try {
      addLog({
        type: "switchNetwork",
        message: `${networkParams.chainName} (${networkParams.chainId})`,
      });
      const result = await getProvider().request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkParams.chainId }],
      });
      setResult(result);
      setCurrentNetwork(networkParams);
    } catch (error) {
      addLog({
        type: "switchNetwork",
        message: `error: ${JSON.stringify(error)}`,
      });
      // https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_switchethereumchain/
      if (error.code === 4902) {
        await addNetwork(networkParams);
      } else {
        setResult(error);
        throw error;
      }
    } finally {
      setIsNetworkModalOpen(false);
    }
  };

  const addNetwork = async (networkParams: NetworkParams) => {
    addLog({
      type: "addNetwork",
      message: `${networkParams.chainName} (${networkParams.chainId})`,
    });
    const result = await getProvider().request({
      method: "wallet_addEthereumChain",
      params: [networkParams],
    });
    setResult(result);
    setCurrentNetwork(networkParams);
    setIsNetworkModalOpen(false);
  };

  const approve = async () => {
    const provider = new ethers.BrowserProvider(await getProvider());
    const address = (await getAccounts())![0];
    const signer = new ethers.JsonRpcSigner(provider, address);

    const contract = new ethers.Contract(
      currentNetwork.usdcAddress,
      erc20Abi,
      signer
    );

    const decimals = await contract.decimals();
    const amount = ethers.parseUnits(approvalAmount, decimals);

    addLog({ type: "approve", message: `amount: ${amount}` });

    const result = await contract.approve(address, amount);

    addLog({ type: "approve", message: `result: ${result}` });

    setResult(result);
  };

  return (
    <>
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
        <header className="row-start-1 w-full flex justify-between items-center gap-4 p-4 bg-gray-100">
          <h1 className="text-2xl font-bold">NuFi EVM test dApp</h1>
          <div className="flex gap-4">
            <Button
              label={`Network: ${currentNetwork.chainName} (${currentNetwork.chainId})`}
              onClick={() => setIsNetworkModalOpen(true)}
            />
            <Button
              label={
                connectedAccount
                  ? `Connected: ${connectedAccount.slice(
                      0,
                      6
                    )}...${connectedAccount.slice(-4)}`
                  : "Connect"
              }
              onClick={() => connect()}
            />
          </div>
        </header>

        <NetworkModal
          isOpen={isNetworkModalOpen}
          onClose={() => setIsNetworkModalOpen(false)}
          initialNetworkParams={currentNetwork}
          onSwitchNetwork={switchNetwork}
          onAddNetwork={addNetwork}
        />

        <main className="flex flex-col gap-8 items-center sm:items-start p-8 bg-white">
          <div className="grid grid-cols-4 gap-4 w-full">
            <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold">Get Accounts</h3>
              <Button label="Get Accounts" onClick={() => getAccounts()} />
            </div>

            <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold">Approve USDC</h3>
              <Input
                label="Approval Amount"
                value={approvalAmount}
                onChange={setApprovalAmount}
              />
              <Button label="Approve" onClick={() => approve()} />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg w-full">
            <h3 className="text-lg font-bold">Events Emitted</h3>
            <div className="flex flex-col gap-2 mt-2">
              {logs.map((event, index) => (
                <div key={index}>
                  {event.type}: {event.message}{" "}
                  {event.chainName ? `(${event.chainName})` : ""}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg w-full">
            <h3 className="text-lg font-bold">Result</h3>
            <pre className="mt-2">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </main>
        <footer className="flex gap-6 flex-wrap items-center justify-center p-4 bg-gray-100">
          <a
            href="https://nu.fi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900"
          >
            <NufiIcon />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900"
          >
            <GithubIcon />
          </a>
          <a
            href="https://x.com/nufiwallet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900"
          >
            <TwitterIcon />
          </a>
        </footer>
      </div>
    </>
  );
}
