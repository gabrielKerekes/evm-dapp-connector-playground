import { useState } from "react";
import { ethers } from "ethers";

import { NetworkParams } from "../constants";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ActionWrapper } from "../components/ActionWrapper";

type CallType = "APPROVE_TOKEN" | "TRANSFER_TOKEN" | "RAW_DATA";

type Call = {
  type: CallType;
  to: string;
  data: string;
  value: string;
  // Additional fields for token operations
  spender?: string; // For approve
  recipient?: string; // For transfer
  amount?: string; // For both approve and transfer
};

// Helper function to generate approve data
const generateApproveData = (spender: string, amount: string): string => {
  const iface = new ethers.Interface([
    "function approve(address spender, uint256 amount)",
  ]);
  return iface.encodeFunctionData("approve", [spender, amount]);
};

// Helper function to generate transfer data
const generateTransferData = (recipient: string, amount: string): string => {
  const iface = new ethers.Interface([
    "function transfer(address recipient, uint256 amount)",
  ]);
  return iface.encodeFunctionData("transfer", [recipient, amount]);
};

// test data
const APPROVE_DATA =
  "0x095ea7b3000000000000000000000000c336049dd72094d2e4c6ed7aeff5d372c493f7f3000000000000000000000000000000000000000000000000000000000754d4c0";
const TRANSFER_DATA =
  "0xa9059cbb000000000000000000000000b215e81415c308206173e64952a4dd369099c4cf0000000000000000000000000000000000000000000000001bc16d674ec80000";

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
      type: "APPROVE_TOKEN",
      to: "0x5A3B31EF4dF22368A0B8cc64345a3063266A7BB4",
      data: APPROVE_DATA,
      value: "0x0",
      spender: "0xc336049dd72094d2e4c6ed7aeff5d372c493f7f3",
      amount: "0x754d4c0",
    },
    {
      type: "TRANSFER_TOKEN",
      to: "0x5A3B31EF4dF22368A0B8cc64345a3063266A7BB4",
      data: TRANSFER_DATA,
      value: "0x0",
      recipient: "0xb215e81415c308206173e64952a4dd369099c4cf",
      amount: "0x1bc16d674ec80000",
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
        version: "2.0.0",
        from: address,
        chainId: network.chainId,
        atomicRequired,
        calls: calls.map((call) => ({
          to: call.to,
          data: call.data.length > 2 ? call.data : undefined,
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
    const updatedCall = { ...newCalls[index], [field]: value };

    // Update data field based on call type
    if (
      updatedCall.type === "APPROVE_TOKEN" &&
      updatedCall.spender &&
      updatedCall.amount
    ) {
      updatedCall.data = generateApproveData(
        updatedCall.spender,
        updatedCall.amount
      );
    } else if (
      updatedCall.type === "TRANSFER_TOKEN" &&
      updatedCall.recipient &&
      updatedCall.amount
    ) {
      updatedCall.data = generateTransferData(
        updatedCall.recipient,
        updatedCall.amount
      );
    }

    newCalls[index] = updatedCall;
    setCalls(newCalls);
  };

  const addCall = () => {
    setCalls([...calls, { type: "RAW_DATA", to: "", data: "", value: "" }]);
  };

  const removeCall = (index: number) => {
    const newCalls = calls.filter((_, i) => i !== index);
    setCalls(newCalls);
  };

  return (
    <ActionWrapper className="flex-4">
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

          <div className="flex flex-col gap-2">
            <label className="font-medium">Call Type</label>
            <select
              value={call.type}
              onChange={(e) =>
                updateCall(index, "type", e.target.value as CallType)
              }
              className="p-2 border rounded"
            >
              <option value="APPROVE_TOKEN">Approve Token</option>
              <option value="TRANSFER_TOKEN">Transfer Token</option>
              <option value="RAW_DATA">Raw Data</option>
            </select>
          </div>

          <Input
            label="Token Contract Address"
            value={call.to}
            onChange={(value) => updateCall(index, "to", value)}
          />

          {call.type === "APPROVE_TOKEN" && (
            <>
              <Input
                label="Spender Address"
                value={call.spender || ""}
                onChange={(value) => updateCall(index, "spender", value)}
              />
              <Input
                label={`Amount WEI (decimal: ${
                  call.amount ? Number(call.amount) : "0"
                })`}
                value={call.amount || ""}
                onChange={(value) => updateCall(index, "amount", value)}
              />
            </>
          )}

          {call.type === "TRANSFER_TOKEN" && (
            <>
              <Input
                label="Recipient Address"
                value={call.recipient || ""}
                onChange={(value) => updateCall(index, "recipient", value)}
              />
              <Input
                label={`Amount WEI (decimal: ${
                  call.amount ? Number(call.amount) : "0"
                })`}
                value={call.amount || ""}
                onChange={(value) => updateCall(index, "amount", value)}
              />
            </>
          )}

          {call.type === "RAW_DATA" && (
            <Input
              label="Data"
              value={call.data}
              onChange={(value) => updateCall(index, "data", value)}
            />
          )}

          <Input
            label={`Value (wei: ${call.value || "0"}, ETH: ${
              call.value ? ethers.formatEther(call.value) : "0"
            })`}
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
