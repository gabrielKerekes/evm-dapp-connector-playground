import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { chainPresets, NetworkParams } from "./constants";

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNetworkParams: NetworkParams;
  onSwitchNetwork: (params: NetworkParams) => void;
  onAddNetwork: (params: NetworkParams) => void;
}

export function NetworkModal({
  isOpen,
  onClose,
  initialNetworkParams,
  onSwitchNetwork,
  onAddNetwork,
}: NetworkModalProps) {
  const [networkParams, setNetworkParams] = useState(initialNetworkParams);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Select Network</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
          onChange={(e) => {
            const value = e.target.value;
            if (value in chainPresets && (value as keyof typeof chainPresets)) {
              setNetworkParams(
                chainPresets[value as keyof typeof chainPresets]
              );
            }
          }}
          value={Object.keys(chainPresets).find(
            (key) =>
              chainPresets[key as keyof typeof chainPresets].chainName ===
              networkParams.chainName
          )}
        >
          {Object.keys(chainPresets).map((chain) => (
            <option key={chain} value={chain}>
              {chainPresets[chain as keyof typeof chainPresets].chainName}
            </option>
          ))}
        </select>
        <Input
          label="Chain ID"
          value={networkParams.chainId}
          onChange={(value) =>
            setNetworkParams({ ...networkParams, chainId: value })
          }
        />
        <Input
          label="RPC URL"
          value={networkParams.rpcUrls[0]}
          onChange={(value) =>
            setNetworkParams({ ...networkParams, rpcUrls: [value] })
          }
        />
        <Input
          label="Chain Name"
          value={networkParams.chainName}
          onChange={(value) =>
            setNetworkParams({ ...networkParams, chainName: value })
          }
        />
        <Input
          label="Block Explorer URL"
          value={networkParams.blockExplorerUrls[0]}
          onChange={(value) =>
            setNetworkParams({
              ...networkParams,
              blockExplorerUrls: [value],
            })
          }
        />
        <div className="flex gap-4 mt-4">
          <Button
            label="Switch Network"
            onClick={() => onSwitchNetwork(networkParams)}
          />
          <Button
            label="Add Network"
            onClick={() => onAddNetwork(networkParams)}
          />
        </div>
      </div>
    </div>
  );
}
