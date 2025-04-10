import { useState } from "react";
import { ethers } from "ethers";

import { NetworkParams } from "../constants";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ActionWrapper } from "../components/ActionWrapper";

type Call = {
  to: string;
  data: string;
  value: string;
};

type ExecuteBatchProps = {
  network: NetworkParams;
  provider: ethers.BrowserProvider | null;
  address: string;
  addLog: (log: { type: string; message: string }) => void;
  setResult: (result: unknown) => void;
};

export const ExecuteBatch = ({
  network,
  provider,
  address,
  addLog,
  setResult,
}: ExecuteBatchProps) => {
  const [calls, setCalls] = useState<Call[]>([
    {
      to: "0x254932BD9f59310347861D8ffc8E67629990e2C4",
      data: "0x",
      value: "0x2",
    },
    {
      to: "0xB215E81415c308206173E64952a4dD369099c4CF",
      data: "0x",
      value: "0x3",
    },
  ]);
  const [atomicRequired, setAtomicRequired] = useState<boolean>(true);
  const [explorerLink, setExplorerLink] = useState<string>("");

  const executeBatch = async () => {
    setExplorerLink("");

    if (!provider) {
      addLog({ type: "error", message: "Provider not found" });
      return;
    }

    try {
      // Prepare the wallet_sendCalls request
      const request = {
        version: "1.0",
        from: address,
        chainId: network.chainId,
        atomicRequired,
        calls: calls.map((call) => ({
          to: call.to,
          data: call.data,
          value: call.value,
        })),
      };

      addLog({
        type: "execute",
        message: `Sending batch request: ${JSON.stringify(request)}`,
      });

      // Send the request using the provider
      const result = await provider.send("wallet_sendCalls", [request]);

      addLog({ type: "execute", message: `Result: ${JSON.stringify(result)}` });

      const explorerLink =
        network.blockExplorerUrls?.length > 0
          ? `${network.blockExplorerUrls[0]}/tx/${result.id}`
          : "N/A";
      setExplorerLink(explorerLink);
      setResult("Batch transaction submitted");
    } catch (error: any) {
      // Handle user rejection or other errors
      if (error.code === 4001 || error.message?.includes("user rejected")) {
        addLog({ type: "error", message: "Transaction rejected by user" });
        setResult("Transaction rejected by user");
      } else {
        addLog({
          type: "error",
          message: `Batch execution failed: ${error.message}`,
        });
        setResult(`Batch execution failed: ${error.message}`);
      }
    }
  };

  const updateCall = (index: number, field: keyof Call, value: string) => {
    const newCalls = [...calls];
    newCalls[index] = { ...newCalls[index], [field]: value };
    setCalls(newCalls);
  };

  const addCall = () => {
    setCalls([...calls, { to: "", data: "", value: "" }]);
  };

  const removeCall = (index: number) => {
    const newCalls = calls.filter((_, i) => i !== index);
    setCalls(newCalls);
  };

  return (
    <ActionWrapper>
      <h3 className="text-lg font-bold">Execute Batch</h3>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="atomicRequired"
          checked={atomicRequired}
          onChange={(e) => setAtomicRequired(e.target.checked)}
        />
        <label htmlFor="atomicRequired">Atomic Execution Required</label>
      </div>

      {calls.map((call, index) => (
        <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Call {index + 1}</h4>
            {calls.length > 1 && (
              <button
                onClick={() => removeCall(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          <Input
            label="To Address"
            value={call.to}
            onChange={(value) => updateCall(index, "to", value)}
          />
          <Input
            label="Data"
            value={call.data}
            onChange={(value) => updateCall(index, "data", value)}
          />
          <Input
            label="Value (in wei)"
            value={call.value}
            onChange={(value) => updateCall(index, "value", value)}
          />
        </div>
      ))}

      <Button label="Add Call" onClick={addCall} />
      <Button
        label="Execute Batch"
        onClick={executeBatch}
        disabled={!provider}
      />

      {explorerLink && (
        <a
          href={explorerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline truncate inline-block max-w-full"
        >
          View transaction on explorer
        </a>
      )}
    </ActionWrapper>
  );
};
