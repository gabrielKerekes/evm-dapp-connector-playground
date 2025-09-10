import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { erc20Abi, NetworkParams } from "../constants";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ActionWrapper } from "../components/ActionWrapper";

type TransferTokenProps = {
  network: NetworkParams;
  provider: ethers.BrowserProvider | null;
  address: string;
  addLog: (log: { type: string; message: string }) => void;
  setResult: (result: unknown) => void;
};

export const TransferToken = ({
  network,
  provider,
  address,
  addLog,
  setResult,
}: TransferTokenProps) => {
  const [amount, setAmount] = useState<string>("1");
  const [token, setToken] = useState<string>(network.usdcAddress);
  const [recipient, setRecipient] = useState<string>("");
  const [explorerLink, setExplorerLink] = useState<string>("");

  useEffect(() => {
    setToken(network.usdcAddress);
  }, [network]);

  const transfer = async () => {
    setExplorerLink("");

    if (!provider) {
      addLog({ type: "error", message: "Provider not found" });
      return;
    }

    if (!recipient) {
      addLog({ type: "error", message: "Recipient address is required" });
      return;
    }

    try {
      const signer = new ethers.JsonRpcSigner(provider, address);
      const contract = new ethers.Contract(token, erc20Abi, signer);

      const decimals = await contract.decimals();
      const rawAmount = ethers.parseUnits(amount, decimals);

      addLog({ type: "transfer", message: `Transferring ${amount} tokens to ${recipient}` });

      const tx = await contract.transfer(recipient, rawAmount);
      addLog({ type: "transfer", message: `Transaction hash: ${tx.hash}` });
      
      const explorerLink =
        network.blockExplorerUrls?.length > 0
          ? `${network.blockExplorerUrls[0]}/tx/${tx.hash}`
          : "N/A";
      setExplorerLink(explorerLink);
      setResult("Transaction submitted");
    } catch (error: any) {
      if (error.code === 4001 || error.message?.includes("user rejected")) {
        addLog({ type: "error", message: "Transaction rejected by user" });
        setResult("Transaction rejected by user");
      } else {
        addLog({ type: "error", message: `Transfer failed: ${error.message}` });
        setResult(`Transfer failed: ${error.message}`);
      }
    }
  };

  return (
    <ActionWrapper>
      <h3 className="text-lg font-bold">Transfer Token</h3>
      <Input
        label="Token (defaults to USDC if known for the network)"
        value={token}
        onChange={setToken}
      />
      <Input
        label="Recipient Address"
        value={recipient}
        onChange={setRecipient}
      />
      <Input 
        label="Amount" 
        value={amount} 
        onChange={setAmount} 
      />
      <Button 
        label="Transfer" 
        onClick={() => transfer()} 
        disabled={!provider || !recipient || !token} 
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