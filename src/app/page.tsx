"use client";

import { ethers } from "ethers";
import { useState } from "react";
import { chainPresets, NetworkParams } from "./constants";
import { NetworkModal } from "./actions/network/NetworkModal";
import { GithubIcon } from "./components/icons/GithubIcon";
import { TwitterIcon } from "./components/icons/TwitterIcon";
import { NufiIcon } from "./components/icons/NufiIcon";
import { ApproveToken, ExecuteBatch, WalletStatus } from "./actions";
import { LogsContainer } from "./components/LogsContainer";
import { AddNetwork, SwitchNetwork } from "./actions/network";
import { AccountActions } from "./actions/AccountActions";
import { ActionWrapper } from "./components/ActionWrapper";
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import type { Eip1193Provider } from "ethers";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import {
  mainnet,
  arbitrum,
  base,
  type AppKitNetwork,
} from "@reown/appkit/networks";

const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || "e2033395e5feb92261c486e0b1aab756";
const appKitMetadata = {
  name: "NuFi EVM dapp connector playground",
  description: "NuFi EVM dapp connector playground",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000",
  icons: ["https://nu.fi/favicon.ico"],
};
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, arbitrum, base];
const ethersAdapter = new EthersAdapter();
createAppKit({
  adapters: [ethersAdapter],
  networks,
  metadata: appKitMetadata,
  projectId,
  features: { analytics: true },
});

export default function Home() {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkParams>(
    chainPresets.ethereum
  );
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  // Use Reown AppKit hooks
  const { walletProvider } = useAppKitProvider("eip155");
  const { address: connectedAccount, isConnected } = useAppKitAccount();
  const browserProvider =
    walletProvider &&
    typeof (walletProvider as Eip1193Provider).request === "function"
      ? new ethers.BrowserProvider(walletProvider as Eip1193Provider)
      : null;

  const addLog = ({ type, message }: { type: string; message: any }) => {
    setLogs((prev) => [...prev, { type, message }]);
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <header className="row-start-1 w-full flex justify-between items-center gap-4 p-4 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-2xl font-bold">
          NuFi EVM dapp connector playground
        </h1>
        <div className="flex gap-4 items-center">
          <appkit-button />
          <span>
            {isConnected && connectedAccount
              ? `Connected: ${connectedAccount.slice(
                  0,
                  6
                )}...${connectedAccount.slice(-4)}`
              : "Not connected"}
          </span>
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
          <AccountActions
            provider={browserProvider}
            addLog={addLog}
            setResult={setResult}
          />
          <ApproveToken
            network={currentNetwork}
            provider={browserProvider}
            address={connectedAccount || ""}
            addLog={addLog}
            setResult={setResult}
          />
          <ExecuteBatch
            network={currentNetwork}
            provider={browserProvider}
            address={connectedAccount || ""}
            addLog={addLog}
            setResult={setResult}
          />
          <WalletStatus
            network={currentNetwork}
            provider={browserProvider}
            address={connectedAccount || ""}
            addLog={addLog}
            setResult={setResult}
          />
        </div>
        <div className="grid grid-cols-2 w-full gap-4">
          <LogsContainer logs={logs} />
          <ActionWrapper className="w-full">
            <h3 className="text-lg font-bold">Result</h3>
            <pre className="mt-2 break-all whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </ActionWrapper>
        </div>
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
          href="https://github.com/gabrielKerekes/evm-dapp-connector-playground"
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
  );
}
