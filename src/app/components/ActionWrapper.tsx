export const ActionWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col gap-4 p-4 bg-gray-100 rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-800 ${className}`}
    >
      {children}
    </div>
  );
};
