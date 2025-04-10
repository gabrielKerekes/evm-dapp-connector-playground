import { ethers } from "ethers";
import { Button } from "../components/Button";
import { ActionWrapper } from "../components/ActionWrapper";
import { useState } from "react";
import { Input } from "../components/Input";

type GetAccountsProps = {
  provider: ethers.BrowserProvider | null;
  addLog: (log: { type: string; message: string }) => void;
  setResult: (result: unknown) => void;
};

const getDelegate = async (
  provider: ethers.BrowserProvider,
  address: string
) => {
  const code = await provider.getCode(address);
  const isDelegated = code.startsWith("0xef0100");
  return isDelegated ? `0x${code.replace("0xef0100", "")}` : null;
};

export const AccountActions = ({
  provider,
  addLog,
  setResult,
}: GetAccountsProps) => {
  const [account, setAccount] = useState<string>("");
  const [currentDelegate, setCurrentDelegate] = useState<string | null>(null);
  const [newDelegateAddress, setNewDelegateAddress] = useState<string>(
    "0x63c0c19a282a1b52b07dd5a65b58948a07dae32b"
  );
  const [isLoading, setIsLoading] = useState(false);
  const getAccounts = async () => {
    setIsLoading(true);
    if (!provider) {
      addLog({ type: "error", message: "Provider not found" });
      setIsLoading(false);
      return;
    }

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      addLog({ type: "accounts", message: `Accounts: ${accounts.join(", ")}` });
      setResult(accounts);
      setAccount(accounts[0]);
      setCurrentDelegate(await getDelegate(provider, accounts[0]));
    } catch (error: any) {
      addLog({
        type: "error",
        message: `Failed to get accounts: ${error.message}`,
      });
      setResult(`Failed to get accounts: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const delegate = async (delegateAddress: string) => {
    setIsLoading(true);
    if (!provider) {
      addLog({ type: "error", message: "Provider not found" });
      setIsLoading(false);
      return;
    }

    try {
      const tx = await provider.send("eth_sendTransaction", [
        {
          from: account,
          to: account,
          data: "0x",
          authorizationList: [
            {
              // chainId should be filled by wallet
              chainId: 0,
              address: delegateAddress,
              // txNonce should be filled by wallet
              txNonce: 0,
            },
          ],
        },
      ]);
      addLog({ type: "tx", message: `Tx: ${tx}` });
      const txHash = await provider.waitForTransaction(tx);
      addLog({ type: "txHash", message: `TxHash: ${txHash}` });
      setCurrentDelegate(await getDelegate(provider, account));
    } catch (error: any) {
      addLog({
        type: "error",
        message: `Failed to delegate: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActionWrapper>
      <h3 className="text-lg font-bold">Get Accounts</h3>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <p className="text-sm">Account: {account}</p>
          <p className="text-sm">Delegate: {currentDelegate}</p>
          <Button
            label="Get Accounts"
            onClick={() => getAccounts()}
            disabled={!provider}
          />
          <Input
            label="New Delegate Address"
            value={newDelegateAddress}
            onChange={(value) => setNewDelegateAddress(value)}
          />
          <Button
            label="Delegate"
            onClick={() => delegate(newDelegateAddress)}
            disabled={!provider}
          />
          <Button
            label="Revoke Delegate"
            onClick={() =>
              delegate("0x0000000000000000000000000000000000000000")
            }
            disabled={!provider || !currentDelegate}
          />
        </>
      )}
    </ActionWrapper>
  );
};
