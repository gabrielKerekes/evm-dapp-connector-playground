import { useState } from "react";
import { ethers } from "ethers";

import { NetworkParams } from "../constants";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ActionWrapper } from "../components/ActionWrapper";

type WalletStatusProps = {
  network: NetworkParams;
  provider: ethers.BrowserProvider | null;
  address: string;
  addLog: (log: { type: string; message: string }) => void;
  setResult: (result: unknown) => void;
};

export const WalletStatus = ({
  network,
  provider,
  address,
  addLog,
  setResult,
}: WalletStatusProps) => {
  const [bundleId, setBundleId] = useState<string>("");
  const [capabilities, setCapabilities] = useState<Record<string, any> | null>(
    null
  );
  const [bundleStatus, setBundleStatus] = useState<Record<string, any> | null>(
    null
  );

  const getCapabilities = async () => {
    if (!provider) {
      addLog({ type: "error", message: "Provider not found" });
      return;
    }

    try {
      const result = await provider.send("wallet_getCapabilities", [
        address,
        [network.chainId],
      ]);
      setCapabilities(result);
      addLog({
        type: "execute",
        message: `Capabilities: ${JSON.stringify(result)}`,
      });
      setResult(result);
    } catch (error: any) {
      addLog({
        type: "error",
        message: `Failed to get capabilities: ${error.message}`,
      });
      setResult(`Failed to get capabilities: ${error.message}`);
    }
  };

  const getCallsStatus = async () => {
    if (!provider || !bundleId) {
      addLog({
        type: "error",
        message: "Provider not found or bundle ID not provided",
      });
      return;
    }

    try {
      const result = await provider.send("wallet_getCallsStatus", [bundleId]);
      setBundleStatus(result);
      addLog({
        type: "execute",
        message: `Bundle status: ${JSON.stringify(result)}`,
      });
      setResult(result);
    } catch (error: any) {
      addLog({
        type: "error",
        message: `Failed to get bundle status: ${error.message}`,
      });
      setResult(`Failed to get bundle status: ${error.message}`);
    }
  };

  const showCallsStatus = async () => {
    if (!provider || !bundleId) {
      addLog({
        type: "error",
        message: "Provider not found or bundle ID not provided",
      });
      return;
    }

    try {
      await provider.send("wallet_showCallsStatus", [bundleId]);
      addLog({ type: "execute", message: "Showing bundle status in wallet" });
      setResult("Showing bundle status in wallet");
    } catch (error: any) {
      addLog({
        type: "error",
        message: `Failed to show bundle status: ${error.message}`,
      });
      setResult(`Failed to show bundle status: ${error.message}`);
    }
  };

  return (
    <ActionWrapper className="flex-4">
      <h3 className="text-lg font-bold">Wallet Status</h3>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="font-medium">Get Wallet Capabilities</h4>
          <Button label="Get Capabilities" onClick={getCapabilities} />
          {capabilities && (
            <pre className="p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(capabilities, null, 2)}
            </pre>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-medium">Bundle Status</h4>
          <Input label="Bundle ID" value={bundleId} onChange={setBundleId} />
          <div className="flex gap-2">
            <Button label="Get Status" onClick={getCallsStatus} />
            <Button label="Show in Wallet" onClick={showCallsStatus} />
          </div>
          {bundleStatus && (
            <pre className="p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(bundleStatus, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </ActionWrapper>
  );
};
