import { ethers } from "ethers";
import { Button } from "../components/Button";

type GetAccountsProps = {
  provider: ethers.BrowserProvider | null;
  addLog: (log: { type: string; message: string }) => void;
  setResult: (result: unknown) => void;
};

export const GetAccounts = ({
  provider,
  addLog,
  setResult,
}: GetAccountsProps) => {
  const getAccounts = async () => {
    if (!provider) {
      addLog({ type: "error", message: "Provider not found" });
      return;
    }

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      addLog({ type: "accounts", message: `Accounts: ${accounts.join(", ")}` });
      setResult(accounts);
    } catch (error: any) {
      addLog({
        type: "error",
        message: `Failed to get accounts: ${error.message}`,
      });
      setResult(`Failed to get accounts: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-bold">Get Accounts</h3>
      <Button
        label="Get Accounts"
        onClick={() => getAccounts()}
        disabled={!provider}
      />
    </div>
  );
};
