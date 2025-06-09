type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  level?: "primary" | "secondary" | "danger";
  className?: string;
};

export const Button = ({
  label,
  onClick,
  disabled,
  level = "primary",
}: ButtonProps) => {
  return (
    <button
      className={`text-white p-2 rounded-md ${
        level === "primary" && "bg-blue-500"
      } ${level === "secondary" && "bg-gray-500"} ${
        level === "danger" && "bg-red-500"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} h-10`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
