import { NetworkParams } from "../../constants";
import { SwitchNetwork } from "./SwitchNetwork";
import { AddNetwork } from "./AddNetwork";
import { ethers } from "ethers";

interface NetworkModalProps {
  onClose: () => void;
  network: NetworkParams;
  provider: ethers.BrowserProvider | null;
  addLog: (log: { type: string; message: string }) => void;
  onSwitchNetwork: (network: NetworkParams) => void;
  onAddNetwork: (network: NetworkParams) => void;
}

export function NetworkModal({
  onClose,
  network,
  provider,
  addLog,
  onSwitchNetwork,
  onAddNetwork,
}: NetworkModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 flex flex-col gap-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Network actions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <SwitchNetwork
            network={network}
            provider={provider}
            addLog={addLog}
            onSuccess={(network) => onSwitchNetwork(network)}
          />
        </div>

        <div className="mt-4">
          <AddNetwork
            network={network}
            provider={provider}
            addLog={addLog}
            onSuccess={(network) => onAddNetwork(network)}
          />
        </div>
      </div>
    </div>
  );
}
