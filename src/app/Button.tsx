type ButtonProps = {
  label: string;
  onClick: () => void;
};

export const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <button className="bg-blue-500 text-white p-2 rounded-md" onClick={onClick}>
      {label}
    </button>
  );
};
