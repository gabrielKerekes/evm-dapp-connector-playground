interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function Input({ label, value, onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-gray-900">{label}</label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
