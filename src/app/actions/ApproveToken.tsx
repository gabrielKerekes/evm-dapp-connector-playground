import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { erc20Abi, NetworkParams } from "../constants";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

type ApproveTokenProps = {
  network: NetworkParams;
  provider: ethers.BrowserProvider | null;
  address: string;
  addLog: (log: { type: string; message: string }) => void;
  setResult: (result: unknown) => void;
};

export const ApproveToken = ({
  network,
  provider,
  address,
  addLog,
  setResult,
}: ApproveTokenProps) => {
  const [amount, setAmount] = useState<string>("123");
  const [token, setToken] = useState<string>(network.usdcAddress);
  const [spender, setSpender] = useState<string>(address);
  const [explorerLink, setExplorerLink] = useState<string>("");

  useEffect(() => {
    setToken(network.usdcAddress);
  }, [network]);

  useEffect(() => {
    setSpender(address);
  }, [address]);

  const approve = async () => {
    setExplorerLink("");

    if (!provider) {
      addLog({ type: "error", message: "Provider not found" });
      return;
    }

    try {
      const signer = new ethers.JsonRpcSigner(provider, address);
      const contract = new ethers.Contract(token, erc20Abi, signer);

      const decimals = await contract.decimals();
      const rawAmount = ethers.parseUnits(amount, decimals);

      addLog({ type: "approve", message: `amount: ${rawAmount}` });

      const result = await contract.approve(spender, rawAmount);
      addLog({ type: "approve", message: `result: ${result}` });
      const explorerLink =
        network.blockExplorerUrls?.length > 0
          ? `${network.blockExplorerUrls[0]}/tx/${result.hash}`
          : "N/A";
      setExplorerLink(explorerLink);
      setResult("Transaction submitted");
    } catch (error: any) {
      // Handle user rejection or other errors
      if (error.code === 4001 || error.message?.includes("user rejected")) {
        addLog({ type: "error", message: "Transaction rejected by user" });
        setResult("Transaction rejected by user");
      } else {
        addLog({ type: "error", message: `Approval failed: ${error.message}` });
        setResult(`Approval failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-bold">Approve Token</h3>
      <Input
        label="Token (defaults to USDC if known for the network)"
        value={token}
        onChange={setToken}
      />
      <Input
        label="Spender (defaults to wallet address)"
        value={spender}
        onChange={setSpender}
      />
      <Input label="Approval Amount" value={amount} onChange={setAmount} />
      <Button label="Approve" onClick={() => approve()} disabled={!provider} />
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
    </div>
  );
};
