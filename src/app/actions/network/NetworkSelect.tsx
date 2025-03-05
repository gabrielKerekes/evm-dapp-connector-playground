import { chainPresets, NetworkParams } from "../../constants";

interface NetworkSelectProps {
  network: NetworkParams;
  onChange: (network: NetworkParams) => void;
  className?: string;
}

export function NetworkSelect({ network, onChange }: NetworkSelectProps) {
  return (
    <select
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      onChange={(e) => {
        const value = e.target.value;
        if (value in chainPresets && (value as keyof typeof chainPresets)) {
          onChange(chainPresets[value as keyof typeof chainPresets]);
        }
      }}
      value={Object.keys(chainPresets).find(
        (key) =>
          chainPresets[key as keyof typeof chainPresets].chainName ===
          network.chainName
      )}
    >
      {Object.keys(chainPresets).map((chain) => (
        <option key={chain} value={chain}>
          {chainPresets[chain as keyof typeof chainPresets].chainName}
        </option>
      ))}
    </select>
  );
}
