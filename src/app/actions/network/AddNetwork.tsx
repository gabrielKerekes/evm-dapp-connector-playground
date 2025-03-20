import { ethers } from "ethers";
import { NetworkParams } from "../../constants";
import { Button } from "../../components/Button";
import { Input } from "@/app/components/Input";
import { useEffect, useState } from "react";
import { NetworkSelect } from "./NetworkSelect";
import { ActionWrapper } from "@/app/components/ActionWrapper";

type AddNetworkProps = {
  network: NetworkParams;
  provider: ethers.BrowserProvider | null;
  addLog: (log: { type: string; message: string }) => void;
  onSuccess?: (network: NetworkParams) => void;
};

export const addNetwork = async (
  network: NetworkParams,
  provider: ethers.BrowserProvider | null,
  addLog: (log: { type: string; message: string }) => void
): Promise<boolean> => {
  if (!provider) {
    addLog({ type: "error", message: "Provider not found" });
    return false;
  }

  try {
    await provider.send("wallet_addEthereumChain", [network]);
    addLog({
      type: "success",
      message: `Added network: ${network.chainName}`,
    });
    return true;
  } catch (error: any) {
    if (error.code === 4001 || error.message?.includes("user rejected")) {
      addLog({ type: "error", message: "Network switch rejected by user" });
      return false;
    } else {
      addLog({
        type: "error",
        message: `Failed to add network: ${error.message}`,
      });
      return false;
    }
  }
};

export const AddNetwork = ({
  network,
  provider,
  addLog,
  onSuccess,
}: AddNetworkProps) => {
  const [newNetworkParams, setNewNetworkParams] = useState(network);

  useEffect(() => {
    setNewNetworkParams(network);
  }, [network]);

  const handleAddNetwork = async () => {
    const success = await addNetwork(newNetworkParams, provider, addLog);
    if (success && onSuccess) {
      onSuccess(newNetworkParams);
    }
  };

  return (
    <ActionWrapper>
      <h3 className="text-lg font-bold">Add network</h3>
      <NetworkSelect
        network={newNetworkParams}
        onChange={setNewNetworkParams}
      />
      <Input
        label="Chain ID"
        value={newNetworkParams.chainId}
        onChange={(value) =>
          setNewNetworkParams({ ...newNetworkParams, chainId: value })
        }
      />
      <Input
        label="Chain Name"
        value={newNetworkParams.chainName}
        onChange={(value) =>
          setNewNetworkParams({ ...newNetworkParams, chainName: value })
        }
      />
      <Input
        label="RPC URL"
        value={newNetworkParams.rpcUrls[0]}
        onChange={(value) =>
          setNewNetworkParams({ ...newNetworkParams, rpcUrls: [value] })
        }
      />
      <Input
        label="Block Explorer URL"
        value={newNetworkParams.blockExplorerUrls[0]}
        onChange={(value) =>
          setNewNetworkParams({
            ...newNetworkParams,
            blockExplorerUrls: [value],
          })
        }
      />
      <Button
        label="Add Network"
        onClick={handleAddNetwork}
        disabled={!provider}
      />
    </ActionWrapper>
  );
};
