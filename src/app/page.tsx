"use client";

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { chainPresets, NetworkParams } from "./constants";
import { Button } from "./components/Button";
import { NetworkModal } from "./actions/network/NetworkModal";
import { GithubIcon } from "./components/icons/GithubIcon";
import { TwitterIcon } from "./components/icons/TwitterIcon";
import { NufiIcon } from "./components/icons/NufiIcon";
import { ApproveToken } from "./actions/ApproveToken";
import { LogsContainer } from "./components/LogsContainer";
import { AddNetwork, SwitchNetwork } from "./actions/network";
import { GetAccounts } from "./actions/GetAccounts";
import { ActionWrapper } from "./components/ActionWrapper";

const getProvider = () => {
  return (window as any).ethereum;
};

export default function Home() {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkParams>(
    chainPresets.ethereum
  );
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [connectedAccount, setConnectedAccount] = useState<string>("");
  const [browserProvider, setBrowserProvider] =
    useState<ethers.BrowserProvider | null>(null);

  const addLog = ({ type, message }: { type: string; message: any }) => {
    console.log("Log:", { type, message });
    setLogs((prev) => [...prev, { type, message }]);
  };

  const onChainChanged = (message: string) => {
    addLog({ type: "event: chainChanged", message });
  };

  const onAccountsChanged = (message: string) => {
    addLog({ type: "event: accountsChanged", message });
  };

  const onDisconnect = (message: string) => {
    addLog({ type: "event: disconnect", message });
  };

  const onConnect = (message: string) => {
    addLog({ type: "event: connect", message });
  };

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      setBrowserProvider(new ethers.BrowserProvider(provider));
    }
  }, [currentNetwork]);

  const connect = async () => {
    const provider = getProvider();
    if (provider) {
      provider.removeListener("chainChanged", onChainChanged);
      provider.removeListener("accountsChanged", onAccountsChanged);
      provider.removeListener("disconnect", onDisconnect);
      provider.removeListener("connect", onConnect);
    }

    const accounts = await provider.enable();
    setConnectedAccount(accounts[0]);

    provider.on("chainChanged", onChainChanged);
    provider.on("accountsChanged", onAccountsChanged);
    provider.on("disconnect", onDisconnect);
    provider.on("connect", onConnect);

    setResult("Connected");
    setBrowserProvider(new ethers.BrowserProvider(provider));
  };

  return (
    <>
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
        <header className="row-start-1 w-full flex justify-between items-center gap-4 p-4 bg-gray-100 dark:bg-gray-900">
          <h1 className="text-2xl font-bold">
            NuFi EVM dapp connector playground
          </h1>
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

        {isNetworkModalOpen && (
          <NetworkModal
            onClose={() => setIsNetworkModalOpen(false)}
            network={currentNetwork}
            provider={browserProvider}
            addLog={addLog}
            onSwitchNetwork={(network) => {
              setCurrentNetwork(network);
              setIsNetworkModalOpen(false);
            }}
            onAddNetwork={(network) => {
              setCurrentNetwork(network);
              setIsNetworkModalOpen(false);
            }}
          />
        )}

        <main className="flex flex-col gap-8 items-center sm:items-start p-8 bg-white dark:bg-gray-900">
          <div className="grid grid-cols-4 gap-4 w-full">
            <SwitchNetwork
              network={currentNetwork}
              provider={browserProvider}
              addLog={addLog}
              onSuccess={setCurrentNetwork}
            />
            <AddNetwork
              network={currentNetwork}
              provider={browserProvider}
              addLog={addLog}
              onSuccess={setCurrentNetwork}
            />
            <GetAccounts
              provider={browserProvider}
              addLog={addLog}
              setResult={setResult}
            />
            <ApproveToken
              network={currentNetwork}
              provider={browserProvider}
              address={connectedAccount}
              addLog={addLog}
              setResult={setResult}
            />
          </div>

          <LogsContainer logs={logs} />

          <ActionWrapper className="w-full">
            <h3 className="text-lg font-bold">Result</h3>
            <pre className="mt-2">{JSON.stringify(result, null, 2)}</pre>
          </ActionWrapper>
        </main>
        <footer className="flex gap-6 flex-wrap items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
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
