import { ethers } from "ethers";
import { NetworkParams } from "../../constants";
import { addNetwork } from "./AddNetwork";
import { NetworkSelect } from "./NetworkSelect";
import { ActionWrapper } from "@/app/components/ActionWrapper";

type SwitchNetworkProps = {
  network: NetworkParams;
  provider: ethers.BrowserProvider | null;
  addLog: (log: { type: string; message: string }) => void;
  onSuccess?: (network: NetworkParams) => void;
};

export const switchNetwork = async (
  network: NetworkParams,
  provider: ethers.BrowserProvider | null,
  addLog: (log: { type: string; message: string }) => void
): Promise<boolean> => {
  if (!provider) {
    addLog({ type: "error", message: "Provider not found" });
    return false;
  }

  try {
    await provider.send("wallet_switchEthereumChain", [
      { chainId: network.chainId },
    ]);
    addLog({
      type: "success",
      message: `Switched to network: ${network.chainName}`,
    });
    return true;
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error?.error?.code === 4902) {
      addLog({
        type: "info",
        message: "Network not found, attempting to add network",
      });
      await addNetwork(network, provider, addLog);
      return true;
    } else if (error.code === "ACTION_REJECTED") {
      addLog({ type: "error", message: "Network switch rejected by user" });
      return false;
    } else {
      addLog({
        type: "error",
        message: `Failed to switch network: ${error.message}`,
      });
      return false;
    }
  }
};

export const SwitchNetwork = ({
  network,
  onSuccess,
  provider,
  addLog,
}: SwitchNetworkProps) => {
  const handleSwitchNetwork = async (network: NetworkParams) => {
    const success = await switchNetwork(network, provider, addLog);
    if (success && onSuccess) {
      onSuccess(network);
    }
  };

  return (
    <ActionWrapper>
      <h3 className="text-lg font-bold">Switch Network</h3>

      <NetworkSelect
        network={network}
        onChange={handleSwitchNetwork}
        className="mb-4"
      />
    </ActionWrapper>
  );
};
